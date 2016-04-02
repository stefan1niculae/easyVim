# Making getters and setters work
Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc


# Expanding base classes is not good practice
String::occurrencesOf = (substr) ->
  occ = 0
  # Take every substring...
  for i in [0..@.length - substr.length]
    # ...and check if it starts with the target substring
    occ++ if @[i..].startsWith substr
  return occ

String::matchesOf = (regex) ->
  # Match returns null when the regex does not match anything
  # instead we want the length to be zero

  # Make sure the regex has the global modifier
  # so it is able to mach multiple times
  source = regex.source  # extract the actual regex, without the flags
  regex = new RegExp source, "g"

  match = @.match regex
  if match?
    return match.length
  return 0

Array::containsOnly = (targets) ->
  for elem in @
    if not _.contains(targets, elem)
      return false
  return true



@Keys =
  left:   37
  right:  39
  up:     38
  down:   40
Keys.directional = [Keys.left, Keys.right, Keys.up, Keys.down]

class KeyListener
  MAX_TIME_BETWEEN_STROKES: 750  # in ms
  MIN_MOVEMENT_STROKES: 0

  @property 'seqStart',
    set: (index) -> @_seqStartIndex = index
    get: ->
      textToCursor = @elem.text()[0...@_seqStartIndex]
      lineCol = @computeLineCol textToCursor, @_seqStartIndex
      return $.extend {index: @_seqStartIndex}, lineCol

  @property 'seqEnd',
    set: (index) -> @_seqEndIndex = index
    get: ->
      textToCursor = @elem.text()[0...@_seqEndIndex]
      lineCol = @computeLineCol textToCursor, @_seqEndIndex
      return $.extend {index: @_seqEndIndex}, lineCol

  computeLineCol: (str, index) ->
    startOfLine = str.lastIndexOf '\n'
    line: 1 + str.occurrencesOf '\n'
    col:  index - startOfLine


  constructor: (@elem) ->
    self = @  # ahh closures
    # Set the event listener
    @elem
      # Because we use the key-up/down events, software-repeated presses are not registered
      .keyup ->
        self.registerKey event.which

    @elem
      .keydown ->
        self.registerKeyDown event.which

    @supportedKeyCodes = []
    for name, code of Keys
      @supportedKeyCodes.push code

    # Prepare for receiving sequences
    @currSeq = []

  registerKeyDown: (code) ->
    if code not in @supportedKeyCodes
      return

    # We set the sequence start on the key-down event because we need to know where
    # the user started moving, BEFORE he moved
    if @currSeq.length == 0
      htmlElem = @elem[0]
      @seqStart = htmlElem.selectionStart

  registerKey: (code) ->
    if code not in @supportedKeyCodes
      return

    # Set starting index when starting adding the first action in the sequence
    htmlElem = @elem[0]
    @seqEnd = htmlElem.selectionStart  # TODO this will need to be updated when working with selections

    @currSeq.push code

    # Start counting, when the timer reaches zero, process the sequence
    # If additional keys are registered before it reaches zero, reset it
    clearTimeout @timer if @timer?
    @timer = setTimeout @processSeq.bind(@), @MAX_TIME_BETWEEN_STROKES  # ahh closures again


  processSeq: ->
    text = @elem.text()
    wentForward = @seqEnd.index - @seqStart.index > 0

    # After a directional sequence the indices can be equal only at one of the text ends
    if @seqStart.index is @seqEnd.index
      traversed = ''
    else
      if wentForward
        traversed = text[@seqStart.index..@seqEnd.index-1]
      else
        traversed = text[@seqEnd.index..@seqStart.index-1]

    ###
    When traversing 'abcd' from left to right -->, the letter we stopped at is 'd'
    But traversing it the other way, right to left <--, the letter we stopped at is 'a'
    Same goes for the next char: on left to right direction, the next char is the one to the right of d
    But on right to left direction, the next char is the one before a
    ###
    beforeStart = text[@seqStart.index - 1]  # the character before the cursor (on the sequence start)
    last = if wentForward then traversed[-1..] else traversed[0]
    next = if wentForward then text[@seqEnd.index] else text[@seqEnd.index - 1]

    ###
    From the Vim documentation (online at http://vimdoc.sourceforge.net/htmldoc/motion.html#word-motions)
      4. Word motions

        w			[count] words forward.  |exclusive| motion.
        W			[count] WORDS forward.  |exclusive| motion.
        e			Forward to the end of word [count] |inclusive|. Does not stop in an empty line.
        E			Forward to the end of WORD [count] |inclusive|. Does not stop in an empty line.
        b			[count] words backward.  |exclusive| motion.
        B			[count] WORDS backward.  |exclusive| motion.
        ge	  Backward to the end of word [count] |inclusive|.
        gE		Backward to the end of WORD [count] |inclusive|.

        A word consists of a sequence of letters, digits and underscores, or a
        sequence of other non-blank characters, separated with white space (spaces,
        tabs, <EOL>).  This can be changed with the 'iskeyword' option.  An empty line
        is also considered to be a word.

        A WORD consists of a sequence of non-blank characters, separated with white
        space.  An empty line is also considered to be a WORD.

    eg:
    This "stuff" is not-so difficult!
    wwww  wwwww  ww www ww wwwwwwwww
    WWWW WWWWWWW WW WWWWWW WWWWWWWWWW
    ###

    # Movement
    # No need to correct if you only went a very small distance
    if traversed.length > 0 and @currSeq.length >= @MIN_MOVEMENT_STROKES and @currSeq.containsOnly Keys.directional
      # Stopping at the start of a WORD (stopped right before a non whitespace) or at the start/end of text
      # This does not give a suggestion if the user stops in the middle of a couple of blank lines

      # 'abc def' from 'b' to 'd'
      if wentForward
        shouldBeWS = last
        shouldNotBeWS = next

      # 'abc def' from 'e' to 'a'
      else
        shouldBeWS = next
        shouldNotBeWS = last

      # The above examples or reached start/end of text
      if next is undefined or (shouldBeWS.match(/\s/) and shouldNotBeWS.match(/\S/))
          count = traversed.matchesOf(/\s+/) + traversed.occurrencesOf "\n\n" # a WORD is delimited by whitespace
          count++ if next is undefined

          # The B command is different from the W command: it also goes back to the start of the current word
          # whereas W skips all the way to the start of the next word
          # whether you started form the middle of the current one or not
          if !wentForward and beforeStart != undefined and beforeStart?.match /\S/
            count++

          motion = if wentForward then "W" else "B"
          suggestCommand count, motion

    # Prepare for the next sequence
    @currSeq = []
    @timer = null




$ ->
  loadSampleText()
  listener = new KeyListener $ "#editor-text"


loadSampleText = () ->
  $.ajax
    url: "samples/W and B tests.txt"
    dataType: "text"
    success: (data) ->
      $ "#editor-text"
        .text data

suggestCommand = (count, motion) ->
  console.log "Suggestion: #{if count > 1 then count else ""}#{motion}"
