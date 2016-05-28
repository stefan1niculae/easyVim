angular.module('easyVimWeb')
  .controller('lessonController', function ($scope, mainService, $rootScope) {

    $scope.localTheme = $rootScope.localTheme;
    console.log("LOCAL THEME", $scope.localTheme)

    $scope.busy = false;
    $scope.chapters = [];
    $scope.lessons = [];
    $scope.currentChapter = {};
    $scope.currentLesson = {};
    $scope.lessonProgress = 0;
    $scope.history = [];
    $scope.previousKeys = [];

    var updateUserProgress = function() {
      $scope.currentChapter = {};
      $scope.currentLesson = {};
      $scope.previousKeys = [];

      $scope.chapters.forEach(function (chapter) {
        chapter.lessons.forEach(function (lesson) {
          if (!$rootScope.user.lessonsCompleted.contains(lesson)) {
            if (lesson.commands.length == 0) {
              $rootScope.user.lessonsCompleted.push(lesson);
            } else if (!$scope.currentChapter._id && !$scope.currentLesson._id) {
              $scope.currentChapter = chapter;
              $scope.currentLesson = lesson;
            }
          } else {
            $scope.previousKeys = $scope.previousKeys.concat(lesson.commands);
          }
        });
      });
    };

    var getData = function () {
      $scope.busy = true;

      mainService.getChapters()
        .then(function (res) {
          console.log("DATA FOR CHAPTERS", res);
          $scope.chapters = res;
          $scope.chapters.sort(function(a, b) {
            return a.order - b.order;
          });
          updateUserProgress();
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

    $scope.selectLesson = function (newLesson, fromChapter) {
      if (isLocked(fromChapter)) {
        return;
      }
      $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
      $scope.currentLesson = newLesson;
      if ($rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
        $scope.lessonProgress = 100;
      } else {
        $scope.lessonProgress = 0;
      }
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
    };

    $scope.isActionPositive = function(action) {
      return action.xp > 0
    };

    var isCompleted = function(chapter) {
      chapter.lessons.forEach(function(lesson) {
        if (!$rootScope.user.lessonsCompleted.contains(lesson)) {
          return false;
        }
      });
      return true;
    };

    getData();

    var unWatchProgress = $rootScope.$on('progressChanged', function(event, increment) {

      $scope.$apply(function(){
        $scope.lessonProgress += increment;
        if ($scope.lessonProgress > 99 && !$rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
          $rootScope.user.lessonsCompleted.push($scope.currentLesson);
          $scope.previousKeys = $scope.previousKeys.concat($scope.currentLesson.commands);
          if (isCompleted($scope.currentChapter)) {
            $scope.addHistory($scope.currentChapter.xpAwarded, "Chapter " + $scope.currentChapter.order + " completed");
          }
          updateUserProgress();
          if ($rootScope.user.lessonsCompleted.contains($scope.currentLesson)) {
            $scope.lessonProgress = 100;
          } else {
            $scope.lessonProgress = 0;
          }
        }
      });
    });

    $rootScope.$on("$destroy", function(){
      unWatchProgress();
    });

    return this;
  });
