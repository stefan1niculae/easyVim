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

    //service.login = function () {
    //  currentUser = null;
    //
    //  return makeCall("GET", '/auth/facebook')
    //    .then(function (profile) {
    //      currentUser = profile;
    //      return service.isLoggedIn();
    //    });
    //};

    service.getUser = function () {
      console.log("USER FRONT", currentUser)
      return currentUser;
    };

    service.isLoggedIn = function () {
      return !!currentUser;
    };

    service.getAuthenticatedUser = function () {
      return makeCall("GET", "/auth/profile")
        .then(function (user) {
          currentUser = user;
          return service.isLoggedIn();
        })
    };


    service.logout = function () {
      currentUser = null;
      return makeCall("GET", '/auth/logout')
    };

    return service;
  });
