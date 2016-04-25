'use strict';
angular.module("easyVim.login")
  .controller('profileController', function ($scope, authService, $state) {

    var $ctrl = this;

    $ctrl.busy = true;
    $ctrl.user = authService.getUser();

    $ctrl.sidebarElements = [
      {
        name: 'Profile',
        clicked: true
      },
      {
        name: 'Achievements',
        clicked: false
      },
      {
        name: 'Progress',
        clicked: false
      },
      {
        name: 'Themes',
        clicked: false
      }
    ];

    $ctrl.selectOption = function (elem) {

      _.forEach($ctrl.sidebarElements, function (elem) {
        elem.clicked = false;
      });
      elem.clicked = true;



    };












    $ctrl.logout = function () {
      $ctrl.busy = true;
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




    return $ctrl;
  });
