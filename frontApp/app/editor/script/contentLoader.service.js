'use strict';
angular.module("easyVim.editor")
  .service('contentLoader', function ($http) {
    var service = {};

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

    service.getLandingContent = function() {
      return makeCall("GET", "../content/landing.md", null, null, {contentType: "text"})
    };





    return service;
  });
