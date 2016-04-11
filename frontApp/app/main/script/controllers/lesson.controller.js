/**
 * Created by Razvan on 4/10/2016.
 */
"use strict";


angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService) {

    $scope.busy = false;
    $scope.lessons = [];
    $scope.currentLesson;
    $scope.levelTask = [];
    $scope.keysPressed = [];

    var getData = function () {
      $scope.busy = true;

      mainService.getLessons()
        .then(function (res) {
          console.log("DATA FOR LESSONS", res);
          $scope.lessons = res;
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    getData();

    $scope.setCurrentLesson = function (lesson) {
      $scope.currentLesson = lesson;
      $scope.levelTask = [];
      $scope.keysPressed = [];
    };

    var checkCommands = function() {
      $scope.currentLesson.cheats.forEach(function(cheat) {
        if($scope.keysPressed.toString().contains(cheat.keycodes.toString())) {
          cheat.finished = true;
        }
      });

      var finishedTasks = 0;
      $scope.currentLesson.cheats.forEach(function(cheat) {
        if(cheat.finished) {
          finishedTasks++;
        }
      });

      if(finishedTasks == $scope.currentLesson.cheats.length) {
        $scope.currentLesson.completed = true;
      }

      $scope.currentLesson.progress = 1 / $scope.currentLesson.cheats.length * finishedTasks;
    };

    $scope.myFunct = function (keyEvent) {
      if(!$scope.currentLesson)
        $scope.setCurrentLesson($scope.lessons.slice(-1)[0]);
      $scope.keysPressed.push(keyEvent.which);
      checkCommands();
    };

    return this;
  });
