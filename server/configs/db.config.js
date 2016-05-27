"use strict";

const MONGO_URL = process.env.MONGO_URL;
const SHOULD_MIGRATE = process.env.SHOULD_MIGRATE;

const logger = require('log4js').getDefaultLogger();

const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);



function config(){
  mongoose.connect(MONGO_URL);
  mongoose.connection.on('error', function (err) {
    logger.error("MongoDB connection error. Please make sure that MongoDB is running at the correct adress");
    process.exit(1);
  });
  mongoose.connection.once('open', function (next) {

    if (SHOULD_MIGRATE) {
      //noinspection JSUnresolvedFunction
      require("../migrations/commands")()
         .then(() => {
             return require("../migrations/lessons")();
         })
         .then(() => {
             return require("../migrations/editorThemes")();
         })
         .then(() => {
             return require("../migrations/levels")();
         })
         .then(() => {
             return require("../migrations/challenges")();
         })
         .then(() => {
             return require("../migrations/achievements")();
         })
         .catch(function (err) {
             console.log("ERROR AT MIGRATIONS", err);
         })
         .finally(function () {
             console.log("MIGRATION COMPLETE");
         });
    }

    logger.info('Connected to Mongo database');
  });
}

module.exports = config;