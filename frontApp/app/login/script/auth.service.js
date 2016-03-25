'use strict';
angular.module("easyVim.login")
  .service('authService', function ($http) {
    var service = {};
    var currentUser = null;

    var makeCall = function (verb, url, data, params, headers) {
      var base = "";
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params,
                     headers: headers
                   })
        .then(function (reply) {
          return reply.data
        })
    };

    service.login = function (user, password) {
      currentUser = '';
      return service.isLoggedIn();
    };

    service.logout = function () {
    };

    service.getUser = function () {
      return currentUser;
    };

    service.isLoggedIn = function () {
      return !!currentUser;
    };

    service.getAuthenticatedUser = function () {
      currentUser = '';
    };

    return service;
  });
