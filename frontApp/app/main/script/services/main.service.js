'use strict';
angular.module("easyVimWeb")
  .service('mainService', function ($http) {
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

    service.getBadges = function () {
      return makeCall('GET', '/badges');
    };

    service.addBadge = function () {
      return makeCall('POST', '/badges', {experience: 5});
    };

    service.getCommandSections = function () {
      return makeCall('GET', '/commandSection');
    };

    service.getLessons = function () {
      return makeCall('GET', '/lesson');
    };

    service.getChapters = function () {
      return makeCall('GET', '/chapter');
    };

    service.changeTheme = function (theme) {
      return makeCall("PUT", '/user/currentTheme', theme)
    };

    service.getAllThemes = function () {
      return makeCall("GET", '/theme');
    };

    service.getChallenges = function () {
      return makeCall("GET", "/challenges")
    };

    service.updateLessonsCompleted = function(lesson, xp, gold) {
      return makeCall("PUT", "/user/lessonsCompleted", {lesson: lesson, xp: xp, gold: gold});
    };
    
    service.updateUnLockedChapters = function(chapter) {
      return makeCall("PUT", "/user/unLockedChapters", {chapter: chapter});
    };

    service.getChallengeDifficulties = function () {
      return makeCall("GET", "/challengeDifficulty")
    };

    service.getAchievement = function () {
      return makeCall("GET", '/achievement')
    };

    service.addInvitation = function(invitation){
      return makeCall("POST", '/invitation', invitation);
    };

    service.getInvitations = function(){
      return makeCall("GET", '/invitation');
    }

    return service;
  });
