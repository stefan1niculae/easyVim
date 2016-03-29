$ ->
  loadSampleText()


loadSampleText = () ->
  $.ajax {
    url: "sampleEditorText.txt"
    dataType: "text"
    success: (data) ->
      $ "#editor-text"
        .text data
  }