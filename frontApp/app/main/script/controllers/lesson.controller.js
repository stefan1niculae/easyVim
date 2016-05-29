"use strict";

angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope) {

    $scope.localTheme = $rootScope.user.currentTheme;

    $scope.busy = false;
    $scope.chapters = [];
    $scope.lessons = [];
    $scope.currentChapter = {};
    $scope.currentLesson = {};
    $scope.lessonProgress = 0;
    $scope.history = [];
    $scope.previousKeys = [];
    $scope.pressedKeys = [];
    var levelXP = 0;
    var lessonXP = 0;

    var getNextChapter = function() {
      const currentChapterIndex = $scope.currentChapter ? $scope.chapters.indexOf($scope.currentChapter) : -1;
      return $scope.chapters[currentChapterIndex + 1];
    };

    var getNextLesson = function() {
      lessonXP = 0;
      if (!$scope.currentLesson._id) {
        return $scope.currentChapter.lessons[0];
      }

      $scope.pressedKeys = [];
      if ($scope.currentLesson.order == $scope.currentChapter.lessons.length && isChapterCompleted()) {
        $scope.currentChapter = getNextChapter();
        return $scope.currentChapter.lessons[0];
      } else {
        return $scope.currentChapter.lessons[$scope.currentLesson.order]
      }
    };

    var getData = function () {
      $scope.busy = true;

      mainService.getChapters()
        .then(function (res) {
          console.log("DATA FOR CHAPTERS", res);
          $scope.chapters = res;
          $scope.chapters = _.sortBy($scope.chapters, 'order');
          _.forEach($scope.chapters, function (chapter) {
            chapter.lessons = _.sortBy(chapter.lessons, 'order');
          });
          $scope.currentChapter = getNextChapter();
          $scope.currentLesson = getNextLesson();
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
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    $scope.getLessonProgress = function() {
      return Math.ceil($scope.lessonProgress);
    };

    var updateLessonProgress = function() {
      if ($rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
        $scope.lessonProgress = 100;
      } else {
        $scope.lessonProgress = 0;
      }
    };

    $scope.selectLesson = function (newLesson, fromChapter) {
      if (isLocked(fromChapter)) { return }

      $scope.pressedKeys = [];
      $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
      $scope.currentLesson = newLesson;
      updateLessonProgress();
    };

    var isLocked = function (chapter) {
      return chapter.order > $scope.currentChapter.order;
    };

    var isActive = function(chapter) {
      return chapter === $scope.currentChapter;
    };

    $scope.getChapterClass = function(chapter) {
      if (!isLocked(chapter)) {
        return isActive(chapter) ? 'chapter-active' : 'chapter-inactive'
      } else {
        return 'chapter-locked'
      }
    };

    $scope.isSelected = function(lesson) {
      return lesson === $scope.currentLesson;
    };

    $scope.addHistory = function(xp, command) {
      $rootScope.user.xp += xp;
      $scope.history.push({
        xp: xp,
        command: command
      })
      if ($scope.history.length == 10) {
        $scope.history.shift();
      }
    };

    $scope.isActionPositive = function(action) {
      return action.xp > 0
    };

    var isChapterCompleted = function() {
      var completed = true;
      _.forEach($scope.currentChapter.lessons, function(lesson) {
        if (!$rootScope.user.lessonsCompleted.contains(lesson)) {
          completed = false;
        }
      });
      return completed;
    };

    var checkLevel = function() {
      if (levelXP >= 25) {
        //  TODO next level
        $rootScope.user.xp += 25;
        levelXP += (25 - levelXP);
      }
    };

    getData();

    var unWatchProgress = $rootScope.$on('progressChanged', function(event, increment) {

      $scope.$apply(function(){
        $scope.lessonProgress += increment;
        if ($scope.lessonProgress > 99 && !$rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
          $rootScope.user.lessonsCompleted.push($scope.currentLesson);
          $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
          var goldAwarded = 0;
          if (isChapterCompleted()) {
            $scope.addHistory($scope.currentChapter.xpAwarded, "Chapter " + $scope.currentChapter.order + " completed");
            goldAwarded = $scope.currentChapter.goldAwarded;
            lessonXP += $scope.currentChapter.xpAwarded;
            levelXP += $scope.currentChapter.xpAwarded;
          }
          mainService.updateLessonsCompleted($scope.currentLesson, lessonXP, goldAwarded);
          checkLevel();
          $scope.currentLesson = getNextLesson();
          updateLessonProgress();
        }
      });
    });

    $rootScope.$on("$destroy", function(){
      unWatchProgress();
    });

    return this;
  });
