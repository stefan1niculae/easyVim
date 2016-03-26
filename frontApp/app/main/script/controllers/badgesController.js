'use strict';
angular.module("easyVimWeb")
  .controller('badgesController', function ($scope, mainService) {

    $scope.busy = false;
    $scope.error = false;
    $scope.data = null;

    const getData = function () {
      $scope.busy = true;
      mainService.getBadges()
        .then(function (res) {
          console.log("badges", res);

          $scope.data = res;
        })
        .catch(function (err) {
          $scope.error = err;
        })
        .finally(function () {
          $scope.busy = false;
        });
    };

    getData();


    return this;
  });

