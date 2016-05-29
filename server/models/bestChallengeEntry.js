"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = require('./user');
const challenge = require('./challenge');


const bestChallengeEntry = new mongoose.Schema({
    user: {
        type: user.schema,
        required: ''
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