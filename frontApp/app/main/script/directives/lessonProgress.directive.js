"use strict";

angular.module('easyVimWeb')
  .directive('progressListener', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var expectedKeys = attrs.progressListener;

        var keyCodeMapper = function (keyCode) {
          return String.fromCharCode(keyCode)
        };

        const increment = 100 / 5;
        var pressCount = 0;
        element.bind("keydown keypress", function (event) {
          const pressedCharacter = keyCodeMapper(event.which);
          if (expectedKeys.indexOf(pressedCharacter) > -1 && pressCount < 5) {
            pressCount += 1;
            console.log("apasat ", pressedCharacter);
            $rootScope.$emit('progressChanged', increment);
          }
        });
      }
    }
});
