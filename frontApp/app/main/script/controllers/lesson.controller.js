"use strict";

angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope, SweetAlert, chapters) {

    var openModalLessonComplete = function (lesson) {
      SweetAlert.swal({
        title: "Congratulations",
        text: "Lesson \"" + lesson.name + "\" completed!",
        type: "success",
        confirmButtonText: "Next lesson",
        closeOnConfirm: true
      }, function (isConfirm) {
        $scope.currentLesson = getNextLesson();
        $scope.initialContent = $scope.currentLesson.content;
        updateLessonProgress();
      });
    };


    $scope.localTheme = $rootScope.user.currentTheme;

    $scope.chapters = chapters;
    _.forEach($scope.chapters, function (chapter) {
      chapter.lessons = _.sortBy(chapter.lessons, 'order');
    });
    $scope.currentChapter = getNextChapter();
    $scope.currentLesson = {};
    $scope.currentLesson = getNextLesson();
    $scope.initialContent = $scope.currentLesson.content;

    $scope.lessonProgress = 0;
    $scope.history = [];
    $scope.previousKeys = [];
    $scope.pressedKeys = [];
    var levelXP = 0;
    var lessonXP = 0;

    function getNextChapter() {
      var currentChapterIndex = $rootScope.user.unLockedChapters.length;
      return $scope.chapters[currentChapterIndex];
    };

    function getNextLesson() {
      lessonXP = 0;
      if (!$scope.currentLesson._id) {
        _.forEach($scope.currentChapter.lessons, function(lesson) {
          if($rootScope.user.lessonsCompleted.indexOf(lesson) === -1) {
            $scope.currentLesson = lesson;
            return false;
          }
        });
        return $scope.currentLesson;
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

          if (!newLesson._id) {
            $scope.currentChapter = getNextChapter();
            return $scope.currentChapter.lessons[0];
          }
          return newLesson
        }
      } else {
        return $scope.currentChapter.lessons[$scope.currentLesson.order]
      }
    }

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
        return new Array(+digits.join("") + 1).join("M") + roman;
      };
      return romanize(chapter.order)
    };

    var updateLessonProgress = function () {
      if ($rootScope.user.lessonsCompleted.indexOf($scope.currentLesson) > -1) {
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
      $scope.initialContent = $scope.currentLesson.content;
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
      return $rootScope.user.lessonsCompleted.indexOf(lesson) > -1;
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
        if ($rootScope.user.lessonsCompleted.indexOf(lesson) === -1) {
          completed = false;
        }
      });
      if (completed) {
        mainService.updateUnLockedChapters($scope.currentChapter)
          .then(function() {
            $rootScope.user.unLockedChapters.push($scope.currentChapter);
            console.log("Updated unLockedChapters");
          })
          .catch(function(err) {
            console.log("Could not update unLockedChapters: ", err);
          });
      }
    };

    var checkLevel = function () {
      if (levelXP >= 25) {
        //  TODO next level
        $rootScope.user.xp += 25;
        levelXP += (25 - levelXP);
      }
    };

    var unWatchProgress = $rootScope.$on('progressChanged', function (event, increment) {

      $scope.$apply(function () {
        if ($rootScope.user.lessonsCompleted.indexOf($scope.currentLesson) === -1) {
          $scope.lessonProgress += increment;
          if ($scope.lessonProgress > 99) {
            $rootScope.user.lessonsCompleted.push($scope.currentLesson);
            $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
            var goldAwarded = 0;
            if (isChapterCompleted()) {
              $scope.addHistory($scope.currentChapter.xpAwarded, "Chapter " + $scope.currentChapter.order + " completed");
              goldAwarded = $scope.currentChapter.goldAwarded;
              lessonXP += $scope.currentChapter.xpAwarded;
              levelXP += $scope.currentChapter.xpAwarded;
            }
            mainService.updateLessonsCompleted($scope.currentLesson, lessonXP, goldAwarded)
              .then(function () {
                console.log("Cica a mers");
              })
              .catch(function (err) {
                console.error("error saving the progress", err);
              });
            checkLevel();
            openModalLessonComplete($scope.currentLesson);
          }
        }
      });
    });

    $rootScope.$on("$destroy", function () {
      unWatchProgress();
    });

    return this;
  });
