"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = require('./user');

const bestChallengeEntry = new mongoose.Schema({
    user: {
        type: user.schema,
        required: 'User required for entry'
        // No need for back-ref from user to their best entries
    },
    challenge: {
        type: Schema.Types.ObjectId,
        required: '',
        ref: 'Challenge'
    },

    keySequence: {
        type: String,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('BestChallengeEntry', bestChallengeEntry),
    schema: bestChallengeEntry
};