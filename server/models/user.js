"use strict";

const mongoose = require('mongoose');
const logger = require('log4js').getDefaultLogger();

const userSChema = new mongoose.Schema({
    username: String,
    facebookId: Number,
    picture: String
});

module.exports = mongoose.model('User', userSChema);

