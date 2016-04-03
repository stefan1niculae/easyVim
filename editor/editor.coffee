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

Array::contains = (target) -> _.contains(@, target)



@Keys =
  left:   37
  right:  39
  up:     38
  down:   40

  mouse:  -1

Keys.directional = [Keys.left, Keys.right, Keys.up, Keys.down, Keys.mouse]


class KeyListener
  # Multiple keystrokes form a sequence, this is how we tell they are in the same sequence
  MAX_TIME_BETWEEN_STROKES: 750  # in ms
  # No need to correct if the user has only pressed the directional keys just once or twice
  MIN_MOVEMENT_STROKES: 0
  # It's not feasible to suggest 10W or 14B because that is hard to see without computer guidance
  MAX_WORD_MOVEMENT_COUNT: 6
  # It's easier for vertical line navigation to see the number of lines
  # (the [relative] line numbers are displayed on the side)
  MAX_VERT_MOVEMENT_COUNT: 40
  # Again, the human eye can't easily count more than 4-5 occurrences,
  # especially if they are interwoven with many other symbols
  MAX_ANCHOR_MOVEMENT_COUNT: 4


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


  # FIXME changes made in the text file are not reflected in this...
  # ... traversing still happens on the original document
  # is it because of closures? and how the key/mouse events are bound?
  @property 'elem',
    get: -> $ @selector

  # We can't just set it because it won't be a pointer
  # changes in the element won't reflect in the @htmlElem value
  @property 'htmlElem',
    get: -> @elem[0]

  @property 'text',
    get: -> @elem.text()


  constructor: (@selector) ->
    self = @  # ahh closures
    # Set the event listeners
    @elem
      # Because we use the key-up/down events, software-repeated presses are not registered
      .keydown    -> self.registerKeyDown event.which
      .keyup      -> self.registerKeyUp event.which
      .mousedown  -> self.registerMouseDown()
      .mouseup    -> self.registerMouseUp()

    @supportedKeyCodes = []
    for name, code of Keys
      @supportedKeyCodes.push code

    # Prepare for receiving sequences
    @currSeq = []


  registerKeyDown: (code) ->
    if code not in @supportedKeyCodes
      return
    # We set the sequence start on the key-down event because we need to know where
    # the user started moving, BEFORE moving
    @registerPossibleStart()


  registerKeyUp: (code) ->
    if code not in @supportedKeyCodes
      return

    @registerEnd()
    @currSeq.push code

    # Start counting, when the timer reaches zero, process the sequence
    # If additional keys are registered before it reaches zero, reset it
    clearTimeout @timer if @timer?
    @timer = setTimeout @processSeq.bind(@), @MAX_TIME_BETWEEN_STROKES  # ahh closures again


  registerPossibleStart: ->
    # Set starting index when starting adding the first action in the sequence
    if @currSeq.length is 0
      @seqStart = @htmlElem.selectionStart


  registerEnd: ->
    @seqEnd = @htmlElem.selectionStart  # TODO this will need to be updated when working with selections



  registerMouseDown: ->
    # We don't clear the current sequence because L L Click has to be corrected into
    # something different that just ignoring the L L
    @registerPossibleStart()
    # The first click will be registered as starting from the index zero


  registerMouseUp: ->
    # This doesn't work very well if the user is holding the mouse button
    # while moving with the directional keys
    @registerEnd()
    @currSeq.push Keys.mouse

    # Process a mouse click right away: don't wait anymore
    @processSeq()


  processSeq: ->
    wentForward = @seqEnd.index - @seqStart.index > 0

    # After a directional sequence the indices can be equal only at one of the text ends
    if @seqStart.index is @seqEnd.index
      traversed = ''
    else
      if wentForward
        from = @seqStart.index
        to   = @seqEnd.index
      else
        from = @seqEnd.index
        to   = @seqStart.index
      traversed = @text[from..to-1]
#    console.log "traversed:#{traversed}."

    ###
    When traversing 'abcd' from left to right -->, the letter we stopped at is 'd'
    But traversing it the other way, right to left <--, the letter we stopped at is 'a'
    Same goes for the next char: on left to right direction, the next char is the one to the right of d
    But on right to left direction, the next char is the one before a
    ###
    beforeStart = @text[@seqStart.index - 1]  # the character before the cursor (on the sequence start)
    last = if wentForward then traversed[-1..] else traversed[0]
    next = if wentForward then @text[@seqEnd.index] else @text[@seqEnd.index - 1]

    # Movement
    # No need to correct if you only went a very small distance
    # A click has to be corrected always
    # For keystrokes, we check both the traversed distance and the number of keystrokes
    # because a sequence might look like L L L L R R R which is really just L
    if @currSeq.containsOnly(Keys.directional) and (
        (@currSeq.contains(Keys.mouse) and traversed.length > 0) or (
          traversed.length >= @MIN_MOVEMENT_STROKES and @currSeq.length >= @MIN_MOVEMENT_STROKES))

      # Don't give more than one suggestion per sequence
      # but give the "best" suggestion out of the available ones (order them)
      prevRelevant = @suggestVertMovement wentForward
      prevRelevant = @suggestHomeEndMovement next if not prevRelevant
      prevRelevant = @suggestWordMovement traversed, wentForward, beforeStart, last, next if not prevRelevant
      @suggestAnchorMovement wentForward, next if not prevRelevant


    # Prepare for the next sequence
    @currSeq = []
    @timer = null


  suggestVertMovement: (wentForward) ->
    ###
    From the Vim documentation (online at http://vimdoc.sourceforge.net/htmldoc/motion.html#up-down-motions)
      k       [count] lines upward.
      j			  [count] lines downward.

      Remember: J looks a bit like a down arrow so it means go down
                Also in romanian the word for down starts with J
    ###
    distance = Math.abs @seqEnd.line - @seqStart.line

    # Didn't move vertically or moved too much
    if distance is 0 or distance > @MAX_VERT_MOVEMENT_COUNT
      return false

    # Landed on the same column, because the target line is at least the same length as the starting one
    # or landed on the last column (ie: next char is newline), because the target line is not long enough
    # or we reached the end of the file
    immNext = @text[@seqEnd.index]
    # This does not take into account the case when you go from a long line to a short line to a long one again
    # eg: (| denotes cursor position)
    # longlo|ng   <-- start
    # short|      <-- stop
    # longlo|ng   <-- next, here
    if @seqEnd.line is 1
      lineEndCol = @text.indexOf '\n'
    else
      lineStartIndex = 1 + @text[0..@seqEnd.index-1].lastIndexOf '\n'
      lineEndCol = @text[lineStartIndex...].indexOf('\n')
    if @seqEnd.col is @seqStart.col or (
      (immNext is '\n' or immNext is undefined) and lineEndCol < @seqStart.col)
      motion = if wentForward then "j" else "k"
      suggestCommand distance, motion
      return true

    return false


  suggestHomeEndMovement: (next) ->
    ###
    From the Vim documentation (online at http://vimdoc.sourceforge.net/htmldoc/motion.html#<Home>)
      0			  To the first character of the line. motion.
      ^			  To the first non-blank character of the line. motion.
      $       To the end of the line.
    ###
#    console.log "start line = #{@seqStart.line}, end line = #{@seqEnd.line}"
    # Moving horizontally on a line (start and end lines are the same, columns must differ...
    # ... but that requirement is met by checking that traversed has nonzero length)
    if @seqStart.line isnt @seqEnd.line
      return false

    # At the start of the line (column is one)
    if @seqEnd.col is 1
      suggestCommand 1, '0'
      return true

    # At the end of the line (next character is newline)
    # ... remember, start and end line have to be the same (and the traversed distance nonzero)
    if next is '\n'
      suggestCommand 1, '$'
      return true

    stoppedAt = @text[@seqEnd.index]
    if stoppedAt?.match /^\S$/
      lineStart = if @seqEnd.line is 1 then 0 else 1 + @text[0..@seqEnd.index].lastIndexOf '\n'
      fromLineStart = @text[lineStart..@seqEnd.index-1]
      # Check if this is the first non-blank character of the line(ie: everything before it is whitespace)
      # Could have also been s+ because at least one whitespace char has to be there
      # otherwise it would have been picked by the '0' suggestion
      if fromLineStart.match /^\s*$/
        suggestCommand 1, '^'
        return true

    return false


  suggestWordMovement: (traversed, wentForward, beforeStart, last, next) ->
    ###
    From the Vim documentation (online at http://vimdoc.sourceforge.net/htmldoc/motion.html#word-motions)
      4. Word motions

        w			[count] words forward. motion.
        W			[count] WORDS forward. motion.
        e			Forward to the end of word [count]. Does not stop in an empty line.
        E			Forward to the end of WORD [count]. Does not stop in an empty line.
        b			[count] words backward. motion.
        B			[count] WORDS backward. motion.
        ge	  Backward to the end of word [count].
        gE		Backward to the end of WORD [count].

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

    # 'abc def' from 'b' to 'd'
    if wentForward
      shouldBeWS = last
      shouldNotBeWS = next
    # 'abc def' from 'e' to 'a'
    else
      shouldBeWS = next
      shouldNotBeWS = last

    # The above examples or reached start/end of text
    # Stopping at the start of a WORD (stopped right before a non whitespace) or at the start/end of text
    # This does not give a suggestion if the user stops in the middle of a couple of blank lines
    if not (next is undefined or (shouldBeWS.match(/^\s$/) and shouldNotBeWS.match(/^\S$/)))
      return false

    # A WORD is delimited by whitespace
    # and single newlines count as WORDs as well
    count = traversed.matchesOf(/\s+/) + traversed.occurrencesOf "\n\n"
    # The B command is different from the W command: it also goes back to the start of the current word
    # whereas W skips all the way to the start of the next word
    # whether you started form the middle of the current one or not
    if !wentForward and beforeStart isnt undefined and beforeStart?.match /\S/
      count++
    motion = if wentForward then "W" else "B"

    if count > @MAX_WORD_MOVEMENT_COUNT
      return false

    suggestCommand count, motion
    return true


  suggestAnchorMovement: (wentForward, next) ->
    ###
    From the Vim documentation (online at http://vimdoc.sourceforge.net/htmldoc/motion.html#word-motions)
      2. Left-right motions

      f{char}   To the [count]'th occurrence of {char} to the right. The cursor is placed on {char}.
      F{char}   To the [count]'th occurrence of {char} to the left.  The cursor is placed on {char}.

      t{char}   Till before [count]'th occurrence of {char} to the right. The cursor is placed on the character left of {char}.
      T{char}   Till after  [count]'th occurrence of {char} to the left.  The cursor is placed on the character right of {char}.

      eg:
      abc def?
      f?---->
      t?--->

      def? 123456
          <----F?
           <---T?

      Remember: F can be for Find or Forward to
      We say an anchor is a defining element, one you can jump to, anchor to
    ###
    console.log "next = #{next}"
    return false


$ ->
  loadSampleText()
  listener = new KeyListener "#editor-text"


loadSampleText = () ->
  $.ajax
    url: "samples/fF and tT tests.txt"
    dataType: "text"
    success: (data) ->
      $ "#editor-text"
        .text data

suggestCommand = (count, motion) ->
  console.log "Suggestion: #{if count > 1 then count else ""}#{motion}"
