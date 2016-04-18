# Modes
Vim has two main modes:
- normal mode
- insert mode


## Paiting and inserting
Think of a painter working on a canvas
Most of the time the paintbrush isin't touching the canvas,
the contact happens only when painting.

The same thing should be true for your usage of the _insert_ mode,
aim to be in _insert_ mode as short as possible, for typing only.

This is because Vim offers much more effective navigation commands
available in the _normal_ mode.


## How to know what mode you're in
_Normal_ mode has a fat cursor (you should think of it as being __on__ a
character, instead of __between__ two characters)
_Insert_ mode has a slim cursor
The default mode is _normal_

Also, in real Vim, the mode is indicated on the bottom left of the screen


## Switching modes
*i* enters insert mode, to the **left** of the current char
*I* enters insert mode at the start of the line

*a* appends, entering insert mode to the **right** of the current char
*A* appends to the end of the line

*o* enter insert mode one line below the current one
*O* enter insert mode one line above the current one

*Esc* exits into normal mode



## Other modes
- visual
- visual-block
- command
modes will be featured in later chapters.

