angular.module('easyVimWeb')
  .controller('AppCtrl', function ($state, $scope, authService) {
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
        state: 'badges',
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

    var user = app.user = authService.getUser();
    app.hideNavbar = false;
    app.title = null;

    $scope.$on('$stateChangeSuccess', function (ev, toState) {
      app.hideNavbar = toState.hideNavbar;
      app.title = toState.title || null;
      var usr = authService.getUser();
      if(app.user !== usr){
        app.user = usr;
      }

    });

    app.logout = function () {
      $scope.busy = true;
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

    $scope.logout = function () {
      app.user = null;
      authService.logout()
        .then(function (res) {
          console.log(res)
        })
        .catch(function (err) {
          console.error("ERROR", err)
        })
    }

  });
