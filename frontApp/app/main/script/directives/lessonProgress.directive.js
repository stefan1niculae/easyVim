"use strict";

angular.module('easyVimWeb')
  .directive('progressListener', function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        currentLesson: "=",
        addHistory: "&",
        pressedKeys: "="
      },
      link: function (scope, element, attrs) {
        var pressedKeys = [];
        var insertModeKeys = ['i', 'a', 'c'];
        var isNormalMode = true;

        var keyCodeMapper = function (keyCode) {
          return String.fromCharCode(keyCode)
        };

        var getIncrement = function() {
          const increment = 100;
          if (scope.currentLesson.commands.length == 0) {
            return increment/5; //  Any 5 keys
          } else {
            return increment/(_.map(scope.currentLesson.commands, 'key').length*2); // Each command should be used twice
          }
        };

        var checkEditorMode = function (keyCode) {
          if (isNormalMode) {
            isNormalMode = !insertModeKeys.contains(keyCodeMapper(keyCode));
          } else {
            isNormalMode = keyCode == 27;
            if (isValidCommand("Esc")) {
              scope.pressedKeys.push("Esc");
              scope.addHistory({xp: 3, command: "Esc"});
              $rootScope.$emit('progressChanged', getIncrement());
            }
          }
        };

        var isCorrect = function(key) {
          if (scope.currentLesson.commands.length == 0) {
            return true;
          } else {
            return _.map(scope.currentLesson.commands, 'key').contains(key)
          }
        };

        var isUsedOnce = function(key) {
          var count = 0;
          scope.pressedKeys.forEach(function(elem) {
            if (elem == key)
              count += 1
          });
          return count <= 1
        };

        var isValidCommand = function(key) {
          return isCorrect(key) && isUsedOnce(key);
        };

        element.bind("keypress", function(event) {
          const pressedCharacter = keyCodeMapper(event.which);

          if (isNormalMode && isValidCommand(pressedCharacter)) {
            scope.pressedKeys.push(pressedCharacter);
            scope.addHistory({xp: 3, command: pressedCharacter});
            $rootScope.$emit('progressChanged', getIncrement());
          }
          checkEditorMode(event.which);
        });

        element.bind("keydown", function(event) {
          checkEditorMode(event.which);
        });

        element.bind('click', function() {
          scope.addHistory({xp: -2, command: "click"});
          $rootScope.$emit('progressChanged', 0);
        });
      }
    }
});
