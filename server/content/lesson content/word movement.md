# Word Movement
What good is it to replace pressing *right* three times with pressing *l* three
times? Sometimes you need to move bigger distances.

You may be familiar with *ctrl* *right* which skips to the next word.
but since we replaced the directional keys with *hjkl* let's see what we can
replace this feature with.


## Replacements or Enhancements
As we'll see in the next chapters, these 'replacements' are actually much more
than that. They not only do everything a normal editor does, but they also
extend this functionallity and integrate it with other Vim components.

You'll see what I'm talking about in a couple of chapters.


### WORD motions
*W* moves one WORD to the right
*E* moves to the end of the current WORD
*B* moves the the previous WORD

### word motions
*w* moves one word To the right
*e* moves to the end of the current word
*b* moves the the previous word

## WORDs and words
In Vim, a word consists of a sequence of letters, digits and underscores, or a
sequence of other non-blank characters, separated with white space (spaces,
tabs, end of line).
A WORD is anything separated by withe space.

    eg:
    This "stuff" is not-so difficult!
    wwww  wwwww  ww www ww wwwwwwwww
    WWWW WWWWWWW WW WWWWWW WWWWWWWWWW


## Bonus
*ge* moves the the end of the previous word


