"use strict";

const LevelInfo = require('../models/levelInfo').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promises = [];

const generator = function () {
    const contents = fs.readFileSync("./content/level info.json");
    const levels = JSON.parse(contents).levels;

    _.forEach(levels, function (level, index) {
        level.number = index + 1;
        promises.push((new LevelInfo(level)).save());
    });
    return Promise.all(promises);
};

module.exports = generator;
