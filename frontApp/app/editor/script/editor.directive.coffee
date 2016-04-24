angular.module 'easyVim.editor'
  .directive 'easyVimDirective', ($rootScope) ->
    restrict: 'E'
    scope: false
    templateUrl: 'views/editor.html'
    link: (scope, element, attrs) ->
      Opentip.styles.Suggestion =
        extends: "glass"
        target: true
        stem: true
        showOn: "creation"


      TOOLTIP_TTL = 5  # in seconds


      $rootScope.$on 'suggestion', (event, data) ->
        scope.$apply () ->
          event.stopPropagation()


          lineNumbers = angular.element ".CodeMirror-linenumber"  # TODO get these from the editor arg, not globally
          for lineNumber in lineNumbers
            if lineNumber.innerHTML is data.line.toString()
              lineNo = angular.element lineNumber
              break

          tip = new Opentip lineNo, data.suggestion,
            style: "Suggestion"
            tipJoint: "center right"
            className: "suggestion-tooltip"
            group: "suggestions"

          # FIXME use coffeescript syntax here
#          hideIt = ->
#            tip.hide()
#          setTimeout(hideIt, TOOLTIP_TTL*1000)

        console.log data.suggestion


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
          lineWrapping: true

        $scope.codeMirrorOptions =
          onLoad: (editor) -> listener = new $$KeyListener editor


        $scope.getEditorContent = $scope.getEditorContent or contentLoader.getLandingContent

        $scope.getEditorContent()
          .then (data) -> $scope.initialContent = data

      intitalize()

      return this
