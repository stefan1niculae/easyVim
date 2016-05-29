"use strict";

angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope, SweetAlert) {
    
    var openModalLessonComplete = function (lesson) {
      SweetAlert.swal({
        title: "Congratulations",
        text: "Lesson " + lesson.name + " completed!",
        type: "success",
        confirmButtonText: "Next lesson",
        closeOnConfirm: true
      }, function (isConfirm) {
        
      });
    };


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

    var getNextChapter = function () {
      var currentChapterIndex = $scope.currentChapter ? $scope.chapters.indexOf($scope.currentChapter) : -1;
      return $scope.chapters[currentChapterIndex + 1];
    };

    var getNextLesson = function () {
      lessonXP = 0;
      if (!$scope.currentLesson._id) {
        return $scope.currentChapter.lessons[0];
      }

      $scope.pressedKeys = [];
      if ($scope.currentLesson.order == $scope.currentChapter.lessons.length) {
        if (isChapterCompleted()) {
          $scope.currentChapter = getNextChapter();
          return $scope.currentChapter.lessons[0];
        } else {
          var newLesson = {};
          _.forEach($scope.currentChapter.lessons, function (lesson) {
            if (!$scope.isCompleted(lesson)) {
              newLesson = lesson;
            }
          });
          console.log(newLesson);
          if (!newLesson._id) {
            $scope.currentChapter = getNextChapter();
            return $scope.currentChapter.lessons[0];
          }
          return newLesson
        }
      } else {
        return $scope.currentChapter.lessons[$scope.currentLesson.order]
      }
    };

    $scope.setNextLesson = function () {
      $scope.currentLesson = getNextLesson();
      updateLessonProgress();
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

    $scope.getLessonProgress = function () {
      return Math.ceil($scope.lessonProgress);
    };

    $scope.getChapterOrder = function (chapter) {
      var romanize = function (num) {
        if (!+num)
          return false;
        var digits = String(+num).split(""),
          key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
          roman = "",
          i = 3;
        while (i--)
          roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
      }
      return romanize(chapter.order)
    };

    var updateLessonProgress = function () {
      if ($rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
        $scope.lessonProgress = 100;
      } else {
        $scope.lessonProgress = 0;
      }
    };

    $scope.selectLesson = function (newLesson, fromChapter) {
      if (isLocked(fromChapter)) {
        return
      }
      if ($scope.currentLesson === newLesson) {
        return
      }

      $scope.pressedKeys = [];
      $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
      $scope.currentLesson = newLesson;
      updateLessonProgress();
    };

    var isLocked = function (chapter) {
      return chapter.order > $scope.currentChapter.order;
    };

    var isActive = function (chapter) {
      return chapter === $scope.currentChapter;
    };

    $scope.getChapterClass = function (chapter) {
      if (!isLocked(chapter)) {
        return isActive(chapter) ? 'chapter-active' : 'chapter-inactive'
      } else {
        return 'chapter-locked'
      }
    };

    $scope.isSelected = function (lesson) {
      return lesson === $scope.currentLesson;
    };

    $scope.isCompleted = function (lesson) {
      return $rootScope.user.lessonsCompleted.contains(lesson);
    };

    $scope.addHistory = function (xp, command) {
      $rootScope.user.xp += xp;
      $scope.history.push({
        xp: xp,
        command: command
      });
      if ($scope.history.length == 10) {
        $scope.history.shift();
      }
    };

    $scope.isActionPositive = function (action) {
      return action.xp > 0
    };

    var isChapterCompleted = function () {
      var completed = true;
      _.forEach($scope.currentChapter.lessons, function (lesson) {
        if (!$rootScope.user.lessonsCompleted.contains(lesson)) {
          completed = false;
        }
      });
      return completed;
    };

    var checkLevel = function () {
      if (levelXP >= 25) {
        //  TODO next level
        $rootScope.user.xp += 25;
        levelXP += (25 - levelXP);
      }
    };

    getData();

    var unWatchProgress = $rootScope.$on('progressChanged', function (event, increment) {

      $scope.$apply(function () {
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
          openModalLessonComplete($scope.currentLesson);
        }
      });
    });

    $rootScope.$on("$destroy", function () {
      unWatchProgress();
    });

    return this;
  });
