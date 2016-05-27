"use strict";

const mongoose = require('mongoose');
const lesson = require('./lesson');
const achievement = require('./achievement');
const levelInfo = require('./levelInfo');
const editorTheme = require('./editorTheme');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    facebookId: {
        type: Number,
        required: ''
    },
    picture: {
        type: String,
        required: ''
    },

    // TODO user level as a property
    xp: {
        type: Number,
        default: 0
    },
    gold: {
        type: Number,
        default: 0
    },

    friendsIds: {
        type: [mongoose.Schema.ObjectId],
        default: []
    },
    lessonsCompleted: {
        type: [lesson.schema],
        default: [],
        ref: 'completedByUsers'
    },
    achievementsUnlocked: {
        type: [achievement.schema],
        default: [],
        ref: 'unlockedByUsers'
    },

    availableEditorThemes: {
        type: [editorTheme.schema],
        default: [],  // TODO the default should be solarized
        ref: 'availableToUsers'
    },
    currentTheme: {
        type: editorTheme.schema,
        ref: 'selectedByUsers'
        // TODO default solarized
    }

});

module.exports = mongoose.model('User', userSchema);
