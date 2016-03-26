(function (angular) {
  'use strict';

  angular
    .module('easyVimWeb', [
      'easyVim.login',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      "ngCookies"
    ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $httpProvider, $stateProvider) {

    $urlRouterProvider.otherwise("/badges");

    $httpProvider.interceptors.push('httpResponseInterceptor');

    $stateProvider.state('badges', {
      url: "/badges",
      templateUrl: "views/badges.html",
      controller: 'badgesController',
      controllerAs: 'badgesCtrl',
      hideNavbar: false
    });

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
