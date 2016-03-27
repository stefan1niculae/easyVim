"use strict";

const mongoose = require('mongoose');
const logger = require('log4js').getDefaultLogger();

const cheatSchema = new mongoose.Schema({
    description: String,
    shortcut: String
});

module.exports = mongoose.model('Cheat', cheatSchema);

