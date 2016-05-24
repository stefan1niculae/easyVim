# Deleting and Changing
Now that you know how to move and select, it's time to put that knowledge to
use: deleting and changing chunks of text

## Deleting
*d{motion}* delete text object
*dd* delete line
*D* delete from cursor to end of line
*x* delete word under cursor

When in visual mode, *d* acts on the selected region.


## Changing
Change is just delete + insert, a shorthand.
*c{motion}* change text object
*cc* change line
*C* delete from cursor to end of line
*r{char}* replace character under cursor with the char given

Both change and delete commands take an optional count.

