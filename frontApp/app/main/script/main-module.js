(function (angular) {
  'use strict';

  angular.module('easyVimWeb', [
      'easyVim.editor',
      'easyVim.login',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      "ngCookies",
      'ui.codemirror',
      'ui.bootstrap',
      'oitozero.ngSweetAlert'
    ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $stateProvider, $httpProvider) {

    $httpProvider.interceptors.push('httpResponseInterceptor');

    $urlRouterProvider.otherwise("/");

    $stateProvider.state('challenges', {
      url: "/challenges",
      templateUrl: "views/challenges.html",
      controller: 'challengeController',
      controllerAs: '$ctrl',
      hideNavbar: false,
      resolve: {
        challengeDifficulties: function (mainService) {
          return mainService.getChallengeDifficulties();
        }
      }
    });

    $stateProvider.state('cheatSheet', {
      url: '/cheatSheet',
      templateUrl: 'views/cheatSheet.html',
      controller: 'cheatSheetController',
      controllerAs: 'cheatSheetCtrl',
      hideNavbar: false,
      resolve: {
        commandSections: function (mainService) {
          return mainService.getCommandSections()
            .then(function (sections) {
              sections.sort(function (a, b) {
                return a.order - b.order;
              });
              return sections;
            })
        }
      }
    });

    $stateProvider.state('lesson', {
      url: '/lesson',
      templateUrl: 'views/lesson.html',
      controller: 'lessonController',
      controllerAs: 'lessonCtrl',
      hideNavBar: false,
      resolve: {
        chapters: function (mainService) {
          return  mainService.getChapters()
            .then(function (res) {
              return _.sortBy(res, 'order');
            })
        }
      }
    })

  }

  function run($rootScope, $state, authService) {

    $rootScope.$on('$stateChangeStart', function (e, to, toParams) {

      var identity = authService.isLoggedIn();

      if (!identity && to.name !== 'login') {
        e.preventDefault();
        $state.go('login',
          {to: to.name, toParams: toParams}, {location: true});
      }

    });

  }

}(angular));
