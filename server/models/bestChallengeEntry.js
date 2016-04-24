"use strict";

const mongoose = require('mongoose');
const user = require('./user');
const challenge = require('./challenge');


const bestChallengeEntry = new mongoose.Schema({
    user: {
        type: user.schema,
        required: '',
        ref: 'bestChallengeEntries'
    },
    challenge: {
        type: challenge.schema,
        required: '',
        ref: 'bestEntries'
    }
});

module.exports = {
    model: mongoose.model('BestChallengeEntry', bestChallengeEntry),
    schema: bestChallengeEntry
};