"use strict";

const _ = require('lodash');

const mongoose = require('mongoose');
const lesson = require('./lesson');
const achievement = require('./achievement');
const LevelInfo = require('./levelInfo').model;
const editorTheme = require('./editorTheme');
const Chapter = require('./chapter').model;
const ChallengeDifficulty = require('./challengeDifficulty').model;

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
    }
    //
    //level: {  // TODO update this when xp is updated
    //    type: Number,
    //    default: 0
    //}

});

userSchema.statics.getLevel = function (user) {
    return LevelInfo.find({})
        .then((levelInfos) => {
            let level = 0;  // start from zero because level 1 is in the list of level infos
            let sum = 0;
            _.chain(levelInfos)
                .sortBy('number')
                .forEach((levelInfo) => {
                    sum += levelInfo.xpNeeded;
                    if (user.xp >= sum)
                        level++;
                    // else break
                })
                .value();

            return level;
        });
};

userSchema.statics.getUnlockedChapters = function (user) {
    return this.getLevel(user)
        .then((level) => {
            return Chapter.find({
                    number: {
                        $lte: level
                    }
                })
                .then((levelInfos) => {
                    return _.chain(levelInfos)
                        .map('unlockedChapter')
                        .filter((e) => e) // some level infos do not unlocked a chapter, so we ignore these
                        .value();
                });
        });
};

userSchema.statics.getUnlockedDifficulties = function (user) {
    return this.getLevel(user)
        .then((level) => {
            return ChallengeDifficulty.find({
                    number: {
                        $lte: level
                    }
                })
                .then((difficulties) => {
                    return _.chain(difficulties)
                        .map('unlockedChallengeDifficulty')
                        .filter((e) => e) // some level infos do not unlocked a chapter, so we ignore these
                        .value();
                });
        })
};


module.exports = mongoose.model('User', userSchema);
