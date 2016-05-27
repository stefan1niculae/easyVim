/**
 * Created by Razvan on 4/10/2016.
 */
"use strict";

angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope) {

    $scope.localTheme = $rootScope.user.currentTheme;
    console.log("LOCAL THEME", $scope.localTheme)

    $scope.busy = false;
    $scope.chapters = [];
    $scope.lessons = [];
    $scope.currentChapter = {};
    $scope.currentLesson = {};
    $scope.lessonProgress = 0;
    $scope.history = [];
    $scope.previousKeys = [];

    var getData = function () {
      $scope.busy = true;

      mainService.getChapters()
        .then(function (res) {
          console.log("DATA FOR CHAPTERS", res);
          $scope.chapters = res;
          $scope.currentChapter = $scope.chapters[0];
          console.log("TEST LESSONS FOR CHAPTER: ", $scope.currentChapter);
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.busy = false;
        });

      mainService.getLessons()
        .then(function (res) {
          console.log("DATA FOR LESSONS", res);
          $scope.lessons = res;
          $scope.currentLesson = {
            name: 'Basic Movements',
            commands: [{key: 'h'}, {key: 'j'}, {key: 'k'}, {key: 'l'}],
            condition: 'Move'
          }
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    $scope.getLessonsForChapter = function(chapter) {
      // return Lesson.$where('this.chapter.name === chapter.name');
      // return $scope.lessons
    };

    $scope.selectLesson = function (newLesson) {
      $scope.previousKeys = $scope.currentLesson.commands;
      $scope.currentLesson = newLesson;
      $scope.lessonProgress = 0;
    };

    var isLocked = function (chapter) {
      return $scope.chapters.indexOf(chapter) <= $scope.chapters.indexOf($scope.currentChapter)
    };

    var isActive = function(chapter) {
      return chapter === $scope.currentChapter;
    };

    $scope.getChapterClass = function(chapter) {
      if (isLocked(chapter)) {
        return isActive(chapter) ? 'chapter-active' : 'chapter-inactive'
      } else {
        return 'chapter-locked'
      }
    };

    // $scope.isSelected = function(lesson) {
    //   return lesson._id === $scope.currentLesson.id;
    // };

    $scope.addHistory = function(xp, command) {
      $scope.history.push({
        xp: xp,
        command: command
      })
    };

    $scope.isActionPositive = function(action) {
      return action.xp > 0
    };

    getData();

    var unWatchProgress = $rootScope.$on('progressChanged', function(event, increment) {

      $scope.$apply(function(){
        $scope.lessonProgress += increment;
      });
    });

    $rootScope.$on("$destroy", function(){
      unWatchProgress();
    });

    return this;
  });
