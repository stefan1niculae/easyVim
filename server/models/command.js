"use strict";

const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    key: {
        type: String,
        required: ''
    },
    description: {
        type: String,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Command', commandSchema),
    schema: commandSchema
};
