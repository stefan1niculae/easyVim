"use strict";

const mongoose = require('mongoose');
const chapter = require('./chapter');
const command = require('./command');

const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'lesson name required'
    },
    description: {
        type: String,
        required: ''
    },
    chapter: {
        type: chapter.schema,
        required: '',
        ref: 'lessons'
    },
    content: {
        type: String,
        default: 'TODO lesson content'
    },
    commands: {
        type: [command.schema],
        default: [],
        ref: 'lessonTaughtIn'
    }
});

module.exports = {
    model: mongoose.model('Lesson', lessonSchema),
    schema: lessonSchema
};
