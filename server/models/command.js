"use strict";

const mongoose = require('mongoose');
const section = require('./commandSection');
const lesson = require('./lesson');

const commandSchema = new mongoose.Schema({
    key: {
        type: String,
        required: ''
    },
    description: {
        type: String,
        required: ''
    },
    section: {
        type: section.schema,
        required: '',
        ref: 'commands'
    },
    order: {
        type: Number,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Command', commandSchema),
    schema: commandSchema
};
