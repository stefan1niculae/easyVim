angular.module("easyVimWeb")
  .service('userService', function ($http) {
    var service = {};

    var makeCall = function (verb, url, data, params, headers) {
      var base = "/api";
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

    service.putAchievements = function (achievements) {
      return makeCall("PUT", '/user/achievements', achievements)
    };

    return service;
  });
