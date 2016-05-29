"use strict";

angular.module('easyVimWeb')
  .controller('cheatSheetController', function ($scope, commandSections) {
    $scope.commandSections = commandSections;

    return this;
  });
