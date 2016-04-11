'use strict';
angular.module("easyVim.login")
  .controller('loginController', function ($scope, $rootScope, authService, $auth) {

    $scope.busy = true;
    $scope.error = false;

    //var verifyAuthentication = function () {
    //  $scope.error = false;
    //
    //    if (authService.isLoggedIn()) {
    //      successLogin();
    //    }
    //    else {
    //      authService.login()
    //        .then(successLogin)
    //        .catch(function (err) {
    //        })
    //        .finally(finallyHandler)
    //    }
    //
    //};
    //
    //verifyAuthentication();

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };


    function successLogin() {
      $rootScope.user = authService.getUser();

      var customRedirectState = 'cheatSheet'; //learn when implemented

      $state.go($state.params.to || customRedirectState, $state.params.toParams,
                {location: 'replace'});
    }

    function finallyHandler() {
      $scope.busy = false;
    }

    $scope.login = function () {
      $scope.busy = true;
      $scope.error = false;

      authService.login()
        .then(function (loggedIn) {
          if (!loggedIn) {
            $scope.error = 'Not logged in, try again';
          }
          else {
            successLogin();
          }
        })
        .catch(function (err) {
          $scope.error = "Please try again";
        })
        .finally(finallyHandler);
    };

    return this;
  });
