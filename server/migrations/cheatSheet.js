const Cheat = require("../models/cheat.js");

const cheatSheet = [];
const _ = require("lodash");

function insertCheat(section, shortcut, description, keycodes) {

    cheatSheet.push({
        section: section,
        shortcut: shortcut,
        description: description,
        keycodes: keycodes
    });
}

const generator = function () {

    insertCheat("basic movement","h","left one character", [104]);
    insertCheat("basic movement","l","right one character", [106]);
    insertCheat("basic movement","j","down one row", [107]);
    insertCheat("basic movement","k","up one row", [108]);
    insertCheat("word movement","w","start of next word", [119]);
    insertCheat("word movement","W","start of next WORD", [87]);
    insertCheat("word movement","b","start of previous word", [98]);
    insertCheat("word movement","B","start of previous WORD", [66]);
    insertCheat("word movement","e","end of word", [101]);
    insertCheat("word movement","E","end of WORD", [69]);
    insertCheat("line movement","0","beginning of line", []);
    insertCheat("line movement","$","end of line", []);
    insertCheat("line movement","^","first non-blank character of the line", []);
    insertCheat("searching","/","first occurrence of pattern", []);
    insertCheat("searching","?","backward search for first occurrence of pattern", []);
    insertCheat("searching","/<CR>","search for last used patter", []);
    insertCheat("searching",":noh","clear highlight", []);
    insertCheat("searching","\c or \C","specifies case sensitivity", []);
    insertCheat("searching","n","next matching search pattern", []);
    insertCheat("searching","N","previous matching search pattern", []);
    insertCheat("searching","*","next occurrence of word under cursor", []);
    insertCheat("searching","#","previous occurrence of word under cursor", []);
    insertCheat("searching","g*","next matching search pattern under cursor", []);
    insertCheat("searching","g#","previous matching search pattern under cursor", []);
    insertCheat("history","u","undo", []);
    insertCheat("history","C-r","redo", []);
    insertCheat("editing","i","insert before cursor", []);
    insertCheat("editing","l","insert at start of line", []);
    insertCheat("editing","a","append after cursor", []);
    insertCheat("editing","A","append at end of line", []);
    insertCheat("editing","o","open newline below(takes count)", []);
    insertCheat("editing","O","open new line above(takes count)", []);
    insertCheat("editing","R","replace mode", []);
    insertCheat("editing","r","replace single character", []);
    insertCheat("editing","s","substitute", []);
    insertCheat("editing","S","substitute line", []);
    insertCheat("editing","C","change to end of line", []);
    insertCheat("positioning","H","top of screen", []);
    insertCheat("positioning","M","middle of screen", []);
    insertCheat("positioning","L","bottom of screen", []);
    insertCheat("positioning","zt","put the line with the cursor at the top", []);
    insertCheat("positioning","zz","put the line with the cursor at the center", []);
    insertCheat("positioning","zb","put the line with the cursor at the bottom of the screen", []);
    insertCheat("jumping","C-u","up half-page", []);
    insertCheat("jumping","C-d","down half-page", []);
    insertCheat("jumping","C-b","backward one page(page up)", []);
    insertCheat("jumping","C-f","forward one page(page down)", []);
    insertCheat("jumping","C-o","jump to last cursor position", []);
    insertCheat("jumping","C-i","jump to next cursor position", []);
    insertCheat("selection","v","enter visual selection mode", []);
    insertCheat("selection","V","enter visual line selection mode", []);
    insertCheat("indentation",">>","indent(map Tab)", []);
    insertCheat("indentation","<<","unindent line(map S-Tab)", []);

    _.forEach(cheatSheet, function (elem) {
        new Cheat(elem).save(function (err, elem) {
            console.log('elem', elem);
        })
    })
};

module.exports = generator;

