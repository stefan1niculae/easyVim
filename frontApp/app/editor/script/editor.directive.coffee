angular.module 'easyVim.editor'
  .directive 'easyVimDirective', ($rootScope) ->
    restrict: 'E'
    scope: false
    templateUrl: 'views/editor.html'
    link: (scope, element, attrs) ->
      $rootScope.$on 'suggestion', (event, suggestion) ->
        scope.$apply () ->
#          event.stopPropagation()

          scope.suggestion = suggestion

          element.triggerHandler 'mouseover'

          console.log suggestion


    controller: ($rootScope, $scope, contentLoader, $$KeyListener) ->
      intitalize = () ->
        $scope.initialContent = '';

        $scope.editorOptions =
          lineNumbers: true
          autofocus: true
          theme: $scope.editorTheme || "solarized light"  # TODO: customize solarized theme
          keyMap: "vim"
          mode: "gfm"
          matchBrackets: true
          closeBrackets: true
          styleActiveLine: true

        $scope.codeMirrorOptions =
          onLoad: (editor) -> listener = new $$KeyListener editor

        contentLoader.getLandingContent()
          .then (data) -> $scope.initialContent = data

      intitalize()

      return this
