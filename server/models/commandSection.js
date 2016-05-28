"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Command = require('./command');

const commandSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    extraInfo: String,
    order: {
        type: Number,
        required: ''
    },
    commands: [{
        type: Schema.Types.ObjectId,
        ref: 'Command',
        required: ''
    }]
});

module.exports = {
    model: mongoose.model('CommandSection', commandSectionSchema),
    schema: commandSectionSchema
};
