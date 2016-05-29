"use strict";

const mongoose = require('mongoose');
const user = require('./user');
const challenge = require('./challenge');


const challengeInvitationSchema = new mongoose.Schema({
    sender: {
        type: user.schema,
        required: '',
        ref: 'challengeInvitationsSent'
    },
    receiver: {
        type: user.schema,
        required: '',
        ref: 'challengeInvitationsReceived'
    },
    challenge: {
        type: challenge.schema,
        required: '',
        ref: 'challengeInvitations'
    },
    honored: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    model: mongoose.model('ChallengeInvitation', challengeInvitationSchema),
    schema: challengeInvitationSchema
};