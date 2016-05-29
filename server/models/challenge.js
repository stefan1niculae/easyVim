"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: Schema.Types.ObjectId,
        required: '',
        ref: 'ChallengeDifficulty'
    },

    startingText: {
        type: String,
        required: ''
    },
    targetText: {
        type: String,
        required: ''
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'BestChallengeDifficulty',
        default: []
    }]
});

module.exports = {
    model: mongoose.model('Challenge', challengeSchema),
    schema: challengeSchema
};