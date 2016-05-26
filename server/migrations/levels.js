"use strict";

const LevelInfo = require('../models/levelInfo').model;
const Chapter = require('../models/chapter').model;
const Difficulty = require('../models/challengeDifficulty').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');


let promises = [];

const generator = function () {
    const chapterPromise = Chapter.find({});
    const difficultyPromise = Difficulty.find({});

    return Promise.all([chapterPromise, difficultyPromise])
        .then((arr) => {
            const chapters = arr[0];
            const difficulties = arr[1];
            const chapterModels = {};
            _.forEach(chapters, function (chapter) {
                chapterModels[chapter.name] = chapter;
            });

            const difficultyModels = {};
            _.forEach(difficulties, function(difficulty) {
                difficultyModels[difficulty.name] = difficulty;
            });

            return generateLevelInfos(chapterModels, difficultyModels);
        })
};

function generateLevelInfos(chapterModels, difficultyModels) {
    const contents = fs.readFileSync("./content/level info.json");
    const levels = JSON.parse(contents).levels;

    _.forEach(levels, function (level, index) {
        level.number = index + 1;
        const chapterName = level.unlockedChapter;
        const difficultyName = level.unlockedChallengeDifficulty;
        if (chapterName !== void 0)
            level.unlockedChapter = chapterModels[chapterName];
        if (difficultyName !== void 0)
            level.unlockedChallengeDifficulty = difficultyModels[difficultyName];
        promises.push((new LevelInfo(level)).save());
    });
    return Promise.all(promises);
}

module.exports = generator;
