/**
 * Created by ionut on 27.05.2016.
 */

"use strict"

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService) {

    var $ctrl = this;

    $ctrl.user = authService.getUser();

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
