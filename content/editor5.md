# Line Movement
Sometimes we don't care how many words there are, we just want to get to the end
of the line.


## Commands
*$* move to end of line
*0* move to start of line
*^* move to first non-blank character in the line

The usefulness of *^* becomes apparent when writing code:

    def main(argv):
        name = argv[1]
        if name is 'null':
            print 'Trying to be clever, eh..?'
        else:
            print 'Hello,', name


... or when working with hierarchical lists.
Summer Plan
  * Build Tree House
    - get wood
    - find big tree
    - plant said tree if unable to find one

  * Visit the Beach
    - do pushups
    - get sunscreen
    - don't forget sun glasses

