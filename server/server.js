'use strict';

require("dotenv").load();

var express = require('express');
var logger = require('log4js').getDefaultLogger();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const mongoose = require('mongoose');

mongoose.connect(mongoUrl);
mongoose.connection.on('error', function (err) {
    logger.error ("MongoDB connection error. Please make sure that MongoDB is running at the correct adress");
    process.exit(1);
});
mongoose.connection.once('open', function (next) {
    logger.info('Connected to Mongo database');
});

const router = require('./router');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.use(function (req, res, next) {
    logger.info("Action initiated", req);

    next()


});

app.use('/api', router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
// no stacktraces leaked to user on production
app.use(function (err, req, res, next) {
    logger.error(err);

    res.status(err.status || 500);
    res.status(500).send({
                error: err,
                message: "Server error"
            });
});

app.on('error', function (err) {
    logger.error(err);
});

app.listen(port);

logger.info("Server listening at port " + port);


