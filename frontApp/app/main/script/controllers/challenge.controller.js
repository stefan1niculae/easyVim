"use strict";

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService, mainService, $rootScope) {

    var $ctrl = this;

    $ctrl.user = $rootScope.user;
    $ctrl.challenges = [];

    $ctrl.getChallenges = function (challenges) {
      mainService.getChallenges()
        .then(function (res) {
          $ctrl.challenges = res;
        })
    };

    $ctrl.putAchievements = function (achievements) {
      userService.putAchievements(achievements)
        .then(function (res) {
          $ctrl.user.achievementsUnlocked += res;
        })
        .catch(function (err) {
          console.error("error on put achievement", err);
        })
    };

    return $ctrl;

  });
