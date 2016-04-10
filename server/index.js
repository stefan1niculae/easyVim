'use strict';

require("dotenv").load();

const cheatSheet = require('./migrations/cheatSheet');
const lessons = require('./migrations/lesson');

const express = require('express');
const logger = require('log4js').getDefaultLogger();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const mongoose = require('mongoose');

mongoose.connect(mongoUrl);
mongoose.connection.on('error', function (err) {
    logger.error ("MongoDB connection error. Please make sure that MongoDB is running at the correct adress");
    process.exit(1);
});
mongoose.connection.once('open', function (next) {
    // cheatSheet();
    // lessons();
    logger.info('Connected to Mongo database');
});

const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(function (req, res, next) {
    const loggedObject = {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params
    };
    logger.info("Action initiated", loggedObject);
    next();
});

app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
    logger.error("Not Found", err);
    res.status(404).send({
        error: err,
        message: "Not Found"
    });
});

// error handler
// no stacktraces leaked to user on production
app.use(function (err, req, res, next) {
    logger.error("Server Error", err);

    res.status(err.status || 500);
    res.status(500).send({
                error: err,
                message: "Server error"
            });
});

app.on('error', function (err) {
    logger.error('Express error', err);
});

app.listen(port);

logger.info("Server listening at port " + port);
