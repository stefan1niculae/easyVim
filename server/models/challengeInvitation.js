"use strict";

const mongoose = require('mongoose');
const user = require('./user');
const challenge = require('./challenge');


const challengeInvitationSchema = new mongoose.Schema({
    challenger: {
        type: user.schema,
        required: '',
        ref: 'challengeInvitationsSent'
    },
    challenged: {
        type: user.schema,
        required: '',
        ref: 'challengeInvitationsReceived'
    },
    challenge: {
        type: challenge.schema,
        required: '',
        ref: 'challengeInvitations'
    }
});

module.exports = {
    model: mongoose.model('ChallengeInvitation', challengeInvitationSchema),
    schema: challengeInvitationSchema
};