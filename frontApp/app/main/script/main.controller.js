angular.module('easyVimWeb')
  .controller('AppCtrl', function ($state, $scope, authService, $rootScope) {
    var app = this;

    $scope.busy = false;

    $scope.views = [
      {
        name: 'Learn',
        state: 'lesson',
        isAccessible: function () {
          return app.user !== null
        }
      },
      {
        name: 'Challenges',
        state: 'challenges',
        isAccessible: function () {
          return app.user !== null
        }
      },
      {
        name: 'Cheat Sheet',
        state: 'cheatSheet',
        isAccessible: function () {
          return true;
        }
      }

    ];

    $rootScope.user = app.user = authService.getUser();
    app.hideNavbar = false;
    app.title = null;

    $scope.$on('$stateChangeSuccess', function (ev, toState) {
      app.hideNavbar = toState.hideNavbar;
      var usr = authService.getUser();
      if(app.user !== usr){
        app.user = usr;
      }

    });

  });
