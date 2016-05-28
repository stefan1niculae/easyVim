"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const chapter = require('./chapter');
const command = require('./command');

const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'lesson name required'
    },
    condition: {
        type: String,
        required: ''
    },
    content: {
        type: String,
        default: 'TODO lesson content'
    },
    commands: {
        type: [command.schema],
        default: [],
        ref: 'lessonTaughtIn'
    },
    order: {
        type: Number,
        required: ''
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Lesson', lessonSchema),
    schema: lessonSchema
};
