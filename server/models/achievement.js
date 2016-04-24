"use strict";

const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    description: {
        type: String,
        required: ''
    },
    picturePath: {
        type: String,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Achievement', achievementSchema),
    schema: achievementSchema
};