'use strict';
angular.module("easyVim.login",['ui.router'])
  .config(function($stateProvider){

    $stateProvider.state('login', {
      url: "/login",
      params: {
        to:false,
        toParams:false,
        retryLogin: true
      },
      templateUrl: "views/login.html",
      controller: 'loginController',
      controllerAs: 'loginCtrl',
      hideNavbar: true
    });
  });
