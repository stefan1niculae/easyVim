# Replacing
Now that you know how to search, it's time to put that skill to use.

## The syntax
*:s/{searched}/{replacing}/* substitutes the first occurrence of the searched
                             string with the replacing string

## Delimiter
Can be anything, but usually it is one of these:
  - _/_ slash
  - _:_ colon
  - _ _ blank
  - _-_ dash

## Range
Can be specified immediately after the colon:
  - _:s_ acts on the current line
  - _:%s_ acts on the whole file
  - entering Visual Mode (_v_) and then typing :s will act upon selected text
  - for more ranges, check out the cheat sheet

## Flags
This is actually a regex, so it accepts flags which can be specified
after the last delimiter
  - _g_ substitutes every occurrence, not just the first
  - for more flags, check out the cheat sheet


## Regex groups
Groups are beyond the scope of this tutorial but we highly encourage
reading about them in order to reap the whole benefits of the
substitution command.
