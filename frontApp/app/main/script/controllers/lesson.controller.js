/**
 * Created by Razvan on 4/10/2016.
 */
"use strict";


angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope) {

    $scope.busy = false;
    $scope.lessons = [];
    $scope.currentLesson = {
      name: "Basic Movement",
      commands: ["h", "j", "k", "l"],
      condition:  "Move around 10 times"
    };
    $scope.lessonProgress = 0;

    var getData = function () {
      $scope.busy = true;

      mainService.getLessons()
        .then(function (res) {
          console.log("DATA FOR LESSONS", res);
          $scope.lessons = res;
          // $scope.currentLesson = $scope.lessons[0];
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    getData();

    var unWatchProgress = $rootScope.$on('progressChanged', function(event, increment) {

      $scope.$apply(function(){
        $scope.lessonProgress += increment;
      });
      console.log("RECEIVED INCREMENT", increment, $scope.lessonProgress)
    });

    $rootScope.$on("$destroy", function(){
      unWatchProgress();
    });

    return this;
  });
