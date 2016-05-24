"use strict";

const mongoose = require('mongoose');

const editorThemeSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: ''
    },
    previewPicPath: {
        type: String,
        required: ''
    },
    codename: {
        type: String,
        required: ''
    },
    price: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('EditorTheme', editorThemeSchema),
    schema: editorThemeSchema
};