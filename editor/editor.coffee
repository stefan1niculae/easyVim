# Making getters and setters work
Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc


# underscore.string conflicts :(
count = (arr, target) ->
  occ = 0
  for elem in arr
    if elem == target
      occ++
  return occ


class KeyListener
  MAX_TIME_BETWEEN_STROKES: 750  # in ms

  Keys:
    left:   37
    right:  39
    up:     38
    down:   40

  @property 'seqStart',
    set: (index) -> @_seqStartIndex = index
    get: ->
      textToCursor = @elem.text()[0...@_seqStartIndex]
      startOfLine = textToCursor.lastIndexOf '\n'

      line: count(textToCursor, '\n') + 1
      col:  @_seqStartIndex - startOfLine

  constructor: (@elem) ->
    self = @  # ahh closures
    # Set the event listener
    @elem
      .keydown ->
        self.registerKey event.which

    # Make the reverse lookup
    @keyNames = {}
    for name, code of @Keys
      @keyNames[code] = name

    # Prepare for receiving sequences
    @currSeq = []


  registerKey: (code) ->
    # Don't trigger for unregistered keys
    if not @keyNames[code]?
      return

    # Set starting index when starting adding the first action in the sequence
    @seqStart = @elem[0].selectionStart if @currSeq.length == 0   # selectionStart is a property of the html elem

    key = @keyNames[code]
    @currSeq.push key

    # Start counting, when the timer reaches zero, process the sequence
    # If additional keys are registered before it reaches zero, reset it
    clearTimeout @timer if @timer?
    @timer = setTimeout @processSeq.bind(@), @MAX_TIME_BETWEEN_STROKES  # ahh closures again

  processSeq: ->
    console.log "processing sequence #{@currSeq} with start line = #{@seqStart.line}, col=#{@seqStart.col}"
    @currSeq = []
    @timer = null


$ ->
  loadSampleText()
  listener = new KeyListener $ "#editor-text"


loadSampleText = () ->
  $.ajax {
    url: "sampleEditorText.txt"
    dataType: "text"
    success: (data) ->
      $ "#editor-text"
        .text data
  }
