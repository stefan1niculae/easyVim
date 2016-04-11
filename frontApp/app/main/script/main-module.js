(function (angular) {
  'use strict';

  angular.module('easyVimWeb', [
      'easyVim.login',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      "ngCookies",
      'ngMaterial',
      'satellizer'
    ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $authProvider, $stateProvider, $mdThemingProvider) {

    $mdThemingProvider.definePalette('appPalette', {
      '50': '#268bd2',
      '100': 'ffcdd2',
      '200': 'ef9a9a',
      '300': 'e57373',
      '400': 'ef5350',
      '500': 'f44336',
      '600': 'e53935',
      '700': 'd32f2f',
      '800': 'c62828',
      '900': 'b71c1c',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': 'd50000',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('appPalette', {
        'hue-2': '50'
      });

    $authProvider.facebook({
                             clientId: '1398417147132089',
                             responseType: 'token',
                             redirectUri: "http://localhost:8080/auth/facebook/callback"
                           });



    $urlRouterProvider.otherwise("/login");

    $stateProvider.state('badges', {
      url: "/badges",
      templateUrl: "views/badges.html",
      controller: 'badgesController',
      controllerAs: 'badgesCtrl',
      hideNavbar: false
    });

    $stateProvider.state('cheatSheet', {
      url: '/cheatSheet',
      templateUrl: 'views/cheatSheet.html',
      controller: 'cheatSheetController',
      controllerAs: 'cheatSheetCtrl',
      hideNavbar: false
    });

    $stateProvider.state('lesson', {
      url: '/lesson',
      templateUrl: 'views/lesson.html',
      controller: 'lessonController',
      controllerAs: 'lessonCtrl',
      hideNavBar: false
    })

  }

  function run($rootScope, $state, authService) {

    //$rootScope.$on('$stateChangeStart', function (e, to, toParams) {
    //
    //  var identity = authService.isLoggedIn();
    //
    //  if (!identity && to.name !== 'login') {
    //    e.preventDefault();
    //    $state.go('login',
    //              {to: to.name, toParams: toParams}, {location: true});
    //  }
    //
    //});

  }

}(angular));
