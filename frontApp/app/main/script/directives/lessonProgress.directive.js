"use strict";

angular.module('easyVimWeb')
  .directive('progressListener', function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        currentLesson: "="
      },
      link: function (scope, element, attrs) {
        var pressedKeys = [];
        var insertModeKeys = ['i', 'a', 'c'];
        var isNormalMode = true;

        var keyCodeMapper = function (keyCode) {
          return String.fromCharCode(keyCode)
        };

        var checkEditorMode = function (keyCode) {
          return isNormalMode = isNormalMode ? !insertModeKeys.contains(keyCodeMapper(keyCode)) : keyCode == 27 /*ESCAPE KEY*/;
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

        const increment = 100 / (_.map(scope.currentLesson.commands, 'key').length*2); // Each command should be used twice

        element.bind("keydown keypress", function (event) {
          const pressedCharacter = keyCodeMapper(event.which);

          if (checkEditorMode(event.which) && isValidCommand(pressedCharacter)) {
            pressedKeys.push(pressedCharacter);
            // scope.addHistory(3, pressedCharacter);
            $rootScope.$emit('progressChanged', increment);
          }
        });
      }
    }
});
