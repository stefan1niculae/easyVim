/**
 * Created by Razvan on 4/10/2016.
 */
"use strict";

angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService) {

  $scope.busy = false;
  $scope.lessons = [];

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

  return this;
});
