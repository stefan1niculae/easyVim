 "use strict";

const mongoose = require('mongoose');
const logger = require('log4js').getDefaultLogger();

const badgeSchema = new mongoose.Schema({
    experience: Number,
    name: String,
    imageName: String
});

module.exports = mongoose.model('Badge', badgeSchema);

