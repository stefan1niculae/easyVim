// url https://docs.google.com/document/d/15j-aCowXP4QGJLj8hC2DHXdPv0MLH0H0IdC4d36IbkA/edit
// order matters
// atom flavored regexes
removeTodos = /\s+TODO.+$/''/;
escapeQuotes = /"/'\"'/;
headers = /^([\w]+)$/'"$1": ['/;
extraInfo = /^(\[count\])$/'    "_extraInfo": "$1",'/;
etries = /^([^"	]+)	+(.+)$/'    {"$1": "$2"},'/; // that's a tab over there
toCaret = /C-([^"\s]+)/'^$1'/;
