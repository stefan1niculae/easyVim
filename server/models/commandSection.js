"use strict";

const mongoose = require('mongoose');

const commandSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    extraInfo: String,
    order: {
        type: Number,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('CommandSection', commandSectionSchema),
    schema: commandSectionSchema
};
