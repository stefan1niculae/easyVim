"use strict";

const EditorTheme = require('../models/editorTheme').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promisses = [];

const generator = function () {
    const contents = fs.readFileSync("./content/commands by section.json");
    const themes = JSON.parse(contents).themes;

    _.forEach(themes, function (theme, index) {
        theme.order = index + 1;
        promisses.push(new EditorTheme(theme).save())
    });
    return Promise.all(promisses);
};

module.exports = generator;
