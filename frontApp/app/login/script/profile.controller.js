'use strict';
angular.module("easyVim.login")
  .controller('profileController', function ($scope, authService, $state, $rootScope, mainService, userService,
                                             themes, achievements, levelInfos) {
    var $ctrl = this;

    $ctrl.themes = themes;
    $ctrl.achievements = achievements;
    $ctrl.levelInfos = levelInfos;

    $ctrl.theme = $rootScope.user.currentTheme;
    $ctrl.user = $rootScope.user;

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

    $ctrl.changeTheme = function (theme) {
      mainService.changeTheme(theme)
        .then(function () {
          $rootScope.user.currentTheme = theme;
          $ctrl.theme = theme;
        })
        .catch(function (err) {
          console.error("error changing the theme", err);
        })
    };

    $ctrl.selectOption = function (elem) {

      _.forEach($ctrl.sidebarElements, function (elem) {
        elem.clicked = false;
      });
      elem.clicked = true;


    };

    $ctrl.logout = function () {
      authService.logout()
        .then(function () {
          $state.go("login", {retryLogin: false}, {reload: true});
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
            || 'Connection Error', err.data));
        })
    };

    return $ctrl;
  });
