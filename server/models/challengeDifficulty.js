"use strict";

const mongoose = require('mongoose');

const challengeDifficultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    order: {
        type: Number,
        required: ''
    },

    invitePrice: {
        type: Number,
        required: ''
    },
    attemptPrice: {
        type: Number,
        required: ''
    },
    completionGold: {
        type: Number,
        required: ''
    },
    completionExperience: {
        type: Number,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('ChallengeDifficulty', challengeDifficultySchema),
    schema: challengeDifficultySchema
};