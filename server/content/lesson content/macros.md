# Macros
One very useful addition to your arsenal is knowing how to use macros.

## Commands
*q{reg}* start recording key sequence into register (usually a letter)
*@{reg}* play the macro in the register
*@@* play the last played macro

Playing macros can also takes a count.
For this reason you should make a macro stop in a place the next repeat
can pick up from.
For example, the *~* command changes the case of the letter under cursor
_and_ it also moves one character right. This lets you enter *10~* to
change the case of the first 10 characters at the cursor.
