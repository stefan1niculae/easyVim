'use strict';
angular.module("easyVim.login",['ui.router'])
  .config(function($stateProvider){

    $stateProvider.state('login', {
      url: "/",
      params: {
        to:false,
        toParams:false,
        retryLogin: true
      },
      templateUrl: "views/landing.html",
      controller: 'landingController',
      controllerAs: 'loginCtrl',
      hideNavbar: true
    });


    $stateProvider.state('profile', {
      url: "/profile",
      templateUrl: "views/profile.html",
      controller: 'profileController',
      controllerAs: '$ctrl',
      hideNavbar: false,
      resolve: {
        themes: function (mainService) {
          return mainService.getAllThemes()
        },
        achievements: function (mainService) {
          return mainService.getAchievement();
        },
        levelInfos: function (userService) {
          return userService.getLevelInfos()
            .then(function (res) {
              res.sort(function (a, b) {
                return a.number - b.number;
              });

              return res;
            });
        }
      }
    });
  });
