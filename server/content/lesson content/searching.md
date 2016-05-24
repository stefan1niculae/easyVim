# Searching
Same as for movement, Vim provides searching functionality both on long and
short ranges


## Short range
*asterisk* moves to the next occurrence of word under cursor
*#*        moves to the previous occurrence of word under cursor
*%*        moves to the matching bracket


## Long range
*/{term}* searches forwards  for the term provided
*?{term}* searches backwards for the term provided
*n* jumps to the next search hit
*N* jumps to the next search hit
*:noh* short for nohiglight clears the last search

_next term_ according to the direction of the search,
for */* it means from left to right, top to bottom,
for *?* it means the opposite direction


## Regex terms
The term can be a simple words, or a regex pattern.
This tutorial does not teach regular expressions, but that is a skill we highly
advise you to master


## Command Mode
Besides the modes you've encountered so far there is also command mode.
You enter it by pressing _:_ from normal mode.
You can exit it by pressing _Enter_
