'use strict';

require("dotenv").load();

const port = process.env.PORT;

const express = require('express');
const logger = require('log4js').getDefaultLogger();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectEnsureLogin = require('connect-ensure-login');

const app = express();

const router = require('./router');
const passportConfig = require('./config/passport');
const mongoConfig = require('./config/mongo');

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

mongoConfig();

const passport = passportConfig.getPassport();
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(function (err, req, res, next) {
    logger.error("Server Error", err);

    res.status(err.status || 500);
    res.status(500).send({
        error: err,
        message: "Server error"
    });
});

app.use(passportConfig.getAuthRoutes());

app.use('/api', connectEnsureLogin.ensureLoggedIn(
  {sendHTTPCode: true}), router);

app.on('error', function (err) {
    logger.error('Express error', err);
});

app.listen(port);

logger.info("Server listening at port " + port);
