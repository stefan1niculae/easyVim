"use strict";

const mongoose = require('mongoose');
const challengeDifficulty = require('./challengeDifficulty');

const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    description: {
        type: String,
        required: ''
    },
    difficulty: {
        type: challengeDifficulty.schema,
        required: '',
        ref: 'challenges'  // TODO
    },

    startingText: {
        type: String,
        required: ''
    },
    targetText: {
        type: String,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Challenge', challengeSchema),
    schema: challengeSchema
};