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

    $urlRouterProvider.otherwise("/login");

    $httpProvider.interceptors.push('httpResponseInterceptor');
    $httpProvider.defaults.withCredentials = true;
    //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    $stateProvider.state('notAuthorized', {
      url: "/not",
      templateUrl: "views/notAuthorized.html",
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
