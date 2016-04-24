"use strict";

const mongoose = require('mongoose');
const chapter = require('./chapter');
const challengeDifficulty = require('./challengeDifficulty');


const levelInfoSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: ''
    },
    xpNeeded: {
        type: Number,
        default: 0
    },
    unlockedChapter: {
        type: chapter.schema,
        ref: 'unlockingLevel'
    },
    unlockedChallengeDifficulty: {
        type: challengeDifficulty.schema,
        ref: 'unlockingLevel'
    }
});

module.exports = {
    model: mongoose.model('LevelInfo', levelInfoSchema),
    schema: levelInfoSchema
};