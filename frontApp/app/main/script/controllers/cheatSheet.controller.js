"use strict";

angular.module('easyVimWeb')
  .controller('cheatSheetController', function ($scope, mainService) {

    $scope.busy = false;
    $scope.data = [];

    var getData = function () {
      $scope.busy = true;

      mainService.getCheatSheet()
        .then(function (cheats) {
          var sections = _.groupBy(cheats, "section");
          $scope.sections = sections;
          console.log("CHEATS", sections)
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
