"use strict";

const ChallengeDifficulty = require('../models/challengeDifficulty').model;
const Challenge = require('../models/challenge').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promises = [];

const generator = function () {
    const contents = fs.readFileSync("./content/challenges by difficulty.json");
    const difficulties = JSON.parse(contents).difficulties;

    _.forEach(difficulties, function (difficulty, index) {
        const dbDifficulty = new ChallengeDifficulty({
            name: difficulty.name,
            invitePrice: difficulty.invitePrice,
            attemptPrice: difficulty.attemptPrice,
            completionGold: difficulty.completionGold,
            completionExperience: difficulty.completionExperience,
            order: index + 1
        }) ;
        promises.push(dbDifficulty.save());


        _.forEach(difficulty.challenges, function(challenge){
            const basePath = "./content/challenge content";
            const startingText = fs.readFileSync(`${basePath}/initial text/${challenge.name.toLowerCase()}.txt`, "utf-8");
            const targetText = fs.readFileSync(`${basePath}/target text/${challenge.name.toLowerCase()}.txt`, "utf-8");

            const dbChallenge = new Challenge({
                name: challenge.name,
                description: challenge.description,
                difficulty: dbDifficulty,
                startingText: startingText,
                targetText: targetText
            });
            promises.push(dbChallenge.save());
        })

    });
    return Promise.all(promises);
};

module.exports = generator;
