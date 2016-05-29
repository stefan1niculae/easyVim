"use strict";

angular.module('easyVimWeb')
  .controller('cheatSheetController', function ($scope, mainService) {

    $scope.busy = false;
    $scope.commandSections = [];

    var getData = function () {
      $scope.busy = true;

      mainService.getCommandSections()
        .then(function (sections) {
          sections.sort(function (a, b) {
            return a.order - b.order;
          });
          $scope.commandSections = sections;
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
