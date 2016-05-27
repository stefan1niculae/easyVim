"use strict";

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService, friends, $rootScope) {
    
    console.log("FRIENDS", friends);

    var $ctrl = this;

    $ctrl.user = $rootScope.user;

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
