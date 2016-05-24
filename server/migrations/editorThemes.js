"use strict";

const EditorTheme = require('../models/editorTheme').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promises = [];

const generator = function () {
    const contents = fs.readFileSync("./content/themes.json");
    const themes = JSON.parse(contents).themes;

    _.forEach(themes, function (theme, index) {
        theme.order = index + 1;
        const dbTheme = new EditorTheme(theme) ;
        promises.push(dbTheme.save());
    });
    return Promise.all(promises);
};

module.exports = generator;
