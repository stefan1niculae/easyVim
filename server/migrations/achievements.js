"use strict";

const Achievement = require('../models/achievement').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promises = [];

const generator = function () {
    const contents = fs.readFileSync("./content/achievements.json");
    const achievements = JSON.parse(contents).achievements;

    _.forEach(achievements, function (achievement, index) {
        const dbAchievement = new Achievement({
            name: achievement.name,
            description: achievement.description,
            order: index + 1,
            picturePath: achievement.picture + '.png'
        });
        promises.push(dbAchievement.save());
    });
    return Promise.all(promises);
};

module.exports = generator;
