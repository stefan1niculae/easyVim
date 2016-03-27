"use strict";

angular.module('easyVimWeb')
  .controller('cheatSheetController', function ($scope, mainService) {

    $scope.busy = false;
    $scope.data = [];

    var getData = function () {
      $scope.busy = true;

      mainService.getCheatSheet()
        .then(function (res) {
          console.log("DATA FOR CHEAY SHEET", res);
          $scope.data = res;
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
