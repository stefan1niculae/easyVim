(function (angular) {
  'use strict';

  angular.module('easyVimWeb', [
      'easyVim.login',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      "ngCookies",
      'ui.codemirror'
  ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $stateProvider, $httpProvider) {

    $httpProvider.interceptors.push('httpResponseInterceptor');

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

    $rootScope.$on('$stateChangeStart', function (e, to, toParams) {

      const identity = authService.isLoggedIn();

      if (!identity && to.name !== 'login') {
        e.preventDefault();
        $state.go('login',
                  {to: to.name, toParams: toParams}, {location: true});
      }

    });

  }

}(angular));
