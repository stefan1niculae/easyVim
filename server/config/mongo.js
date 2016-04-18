"use strict";

const mongoUrl = process.env.MONGO_URL;

console.log("URL DB", mongoUrl);

const cheatSheet = require('../migrations/cheatSheet');
const lessons = require('../migrations/lesson');

const mongoose = require('mongoose');
const logger = require('log4js').getDefaultLogger();

module.exports = () => {
  mongoose.connect(mongoUrl);

  mongoose.connection.on('error', function (err) {
    logger.error("MongoDB connection error. Please make sure that MongoDB is running at the correct adress");
    process.exit(1);
  });

  mongoose.connection.once('open', function (next) {
    // cheatSheet();
    // lessons();
    logger.info('Connected to Mongo database');
  });
  

};