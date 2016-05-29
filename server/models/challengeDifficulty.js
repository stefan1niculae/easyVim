"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    challenges: [{
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        required: ''
    }]
});

module.exports = {
    model: mongoose.model('ChallengeDifficulty', challengeDifficultySchema),
    schema: challengeDifficultySchema
};