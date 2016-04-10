'use strict';
angular.module("easyVim.login")
  .controller('loginController', function ($scope) {

    $scope.busy = true;
    $scope.error = false;

    //var verifyAuthentication = function () {
    //  $scope.error = false;
    //
    //  if ($state.params.retryLogin) {
    //
    //    if (authService.isLoggedIn()) {
    //      successLogin();
    //    }
    //    else {
    //      authService.getAuthenticatedUser()
    //        .then(successLogin)
    //        .catch(function (err) {
    //        })
    //        .finally(finallyHandler)
    //    }
    //  }
    //  else {
    //    $scope.busy = false;
    //  }
    //};
    //
    //verifyAuthentication();
    //
    //function successLogin() {
    //  //for now
    //  var user = authService.getUser();
    //  //change custom redirect page
    //  var customRedirectState = '';
    //
    //  $state.go($state.params.to || customRedirectState, $state.params.toParams,
    //            {location: 'replace'});
    //}
    //
    //function finallyHandler() {
    //  $scope.busy = false;
    //}
    //
    //$scope.login = function (user) {
    //  $scope.busy = true;
    //  $scope.error = false;
    //
    //  authService.login(user.name, user.password)
    //    .then(function (loggedIn) {
    //      if (!loggedIn) {
    //        $scope.error = 'Not logged in, try again';
    //      }
    //      else {
    //        successLogin();
    //      }
    //    })
    //    .catch(function (err) {
    //      $scope.error = "Please try again";
    //    })
    //    .finally(finallyHandler);
    //};

    return this;
  });
