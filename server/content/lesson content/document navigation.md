# Document Navigation
Sometimes it is not practical to count the number of lines to go downwards in
order to get the end of the document.


## Solution
*gg*   jump to first line
*G*    jump to last line
*{n}G* jump to the n-th line

*^o* jump to last postition
*^O* jump to previous postition


You may want to go to the absolute last characer in the file. That can be
achieved by navigating to the last line (*G*) and appending (*A*). If you wish
to do these with a single command, you can modify *G* to do that.
But this is not the scope of this tutorial.

