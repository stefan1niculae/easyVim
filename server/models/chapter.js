"use strict";

const mongoose = require('mongoose');
const Lesson = require('./lesson').model;
const Promise = require('bluebird');

const chapterSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    order: {
        type: Number,
        required: ''
    },
    xpAwarded: {
        type: Number,
        required: ''
    },
    goldAwarded: {
        type: Number,
        required: ''
    }
});

chapterSchema.virtual('lessons').get(function () {
    return Promise.resolve(Lesson.find({chapter: this}))
});

module.exports = {
    model: mongoose.model('Chapter', chapterSchema),
    schema: chapterSchema
};
