# Copying and Pasting
I can't really speak for journalists but programmers rely on copying and pasting
quite a lot. Students as well, but.. in a somewhat different way.
That's why this makes a good skill to have in your editor.


## Copying
Copying used to be called yanking (yank a chunk of text) back in the day.

*y{motion}* copy text object
*Y* copy from cursor to end of line (TODO: not by default!)


## Pasting
*p* paste at cursor location
*P* paste on line above cursor


## Cutting
You already know how to cut!
*d*, *c* and *x* actually do more than just delete the text: they cut it.
We'll get into more detail about registers and buffers in a later chapter.


## Host OS integration
OSX integrates the *y* command with the system clipboard.
On other Unix distributions you may have to play with the settings to get it to
work (will be convered in a configs chapter).
Windows is another story. Unfortunately, not a happy-ending one.

