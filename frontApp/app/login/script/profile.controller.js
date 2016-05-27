'use strict';
angular.module("easyVim.login")
  .controller('profileController', function ($scope, authService, $state, $rootScope, mainService, themes, userService) {

    var $ctrl = this;

    console.log("THEMES", themes);

    $ctrl.themes = themes;

    $ctrl.theme = $rootScope.localTheme;
    $ctrl.busy = true;
    $ctrl.user = authService.getUser();



    $ctrl.changeTheme = function (theme) {
      mainService.changeTheme(theme)
        .then(function (res) {
          $rootScope.localTheme = theme;
          $ctrl.theme = theme;
          console.log("THEME CHANGED", res)
        })
      .catch(function (err) {
        console.error("error changing the theme", err);
      })
    };

    $ctrl.user.achievementsUnlocked = [1,5,6];
    
    $ctrl.user.lessonsCompleted = 100;

    userService.getAchievement()
      .then(function (res) {
        $ctrl.achievements = res;
      });

    $ctrl.sidebarElements = [
      {


        name: 'Profile',
        clicked: true
      },
      {
        name: 'Achievements',
        clicked: false
      },
      {
        name: 'Progress',
        clicked: false
      },
      {
        name: 'Themes',
        clicked: false
      }
    ];

    $ctrl.selectOption = function (elem) {

      _.forEach($ctrl.sidebarElements, function (elem) {
        elem.clicked = false;
      });
      elem.clicked = true;



    };

    $ctrl.logout = function () {
      $ctrl.busy = true;
      authService.logout()
        .then(function () {
          $state.go("login", {retryLogin: false}, {reload: true});
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
            || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;
        })
    };




    return $ctrl;
  });
