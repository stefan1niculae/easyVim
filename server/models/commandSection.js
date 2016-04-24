"use strict";

const mongoose = require('mongoose');
const command = require('./command');

const commandSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    extraInfo: String,
    commands: {
        type: [command.schema],
        default: '',
        ref: 'section'
    }
});

module.exports = {
    model: mongoose.model('CommandSection', commandSectionSchema),
    schema: commandSectionSchema
};
