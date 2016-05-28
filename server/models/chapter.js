"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Lesson = require('./lesson');

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
    },
    lessons : [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: ''
    }]
});

module.exports = {
    model: mongoose.model('Chapter', chapterSchema),
    schema: chapterSchema
};
