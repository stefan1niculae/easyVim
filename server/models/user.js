"use strict";

const mongoose = require('mongoose');
const lesson = require('./lesson');
const achievement = require('./achievement');
const levelInfo = require('./levelInfo');
const editorTheme = require('./editorTheme');

function cumSum(arr, idx) {
    var sum = 0;
    for (var i = 0; i < idx; i++) {
        sum += arr[idx];
    }
    return sum;
}

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
    },

    level: {  // TODO update this when xp is updated
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
