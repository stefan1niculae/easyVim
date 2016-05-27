"use strict";

angular.module('easyVimWeb')
  .directive('progressListener', function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        currentLesson: "=",
        addHistory: "&"
      },
      link: function (scope, element, attrs) {
        var pressedKeys = [];
        var insertModeKeys = ['i', 'a', 'c'];
        var isNormalMode = true;

        var keyCodeMapper = function (keyCode) {
          return String.fromCharCode(keyCode)
        };

        var checkEditorMode = function (keyCode) {
          if (isNormalMode) {
            isNormalMode = !insertModeKeys.contains(keyCodeMapper(keyCode));
          } else {
            isNormalMode = keyCode == 27;
            if (isValidCommand("Esc")) {
              const increment = 100 / (_.map(scope.currentLesson.commands, 'key').length*2); // Each command should be used twice
              pressedKeys.push("Esc");
              scope.addHistory({xp: 3, command: "Esc"});
              $rootScope.$emit('progressChanged', increment);
            }
          }
        };

        var isUsedOnce = function (key) {
          var count = 0;
          pressedKeys.forEach(function(elem) {
            if (elem == key)
              count += 1
          });
          return count <= 1
        };

        var isValidCommand = function (key) {
          return _.map(scope.currentLesson.commands, 'key').contains(key) && isUsedOnce(key);
        };

        element.bind("keypress", function (event) {
          const pressedCharacter = keyCodeMapper(event.which);
          const increment = 100 / (_.map(scope.currentLesson.commands, 'key').length*2); // Each command should be used twice

          if (isNormalMode && isValidCommand(pressedCharacter)) {
            pressedKeys.push(pressedCharacter);
            scope.addHistory({xp: 3, command: pressedCharacter});
            $rootScope.$emit('progressChanged', increment);
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
