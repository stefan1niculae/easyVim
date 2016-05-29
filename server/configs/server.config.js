"use strict";

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectEnsureLogin = require('connect-ensure-login');
const logger = require('log4js').getDefaultLogger();

const learnRouter = require('../routers/learn.router');
const authRouter = require('../routers/auth.router');
const userRouter = require('../routers/user.router');
const challengeRouter = require('../routers/challenge.router');

function config(app) {
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

    app.use('/auth', authRouter);
    // TODO: uncomment when done testing
    // app.use('/api', connectEnsureLogin.ensureLoggedIn({sendHTTPCode: true}), learnRouter, userRouter);

    app.use('/api', learnRouter);
    app.use('/api/user', userRouter);
    app.use('/api', challengeRouter);
    app.use('/api', commandRouter);


    // error handler
    app.use(function (err, req, res, next) {
        logger.error("Server Error", err);

        res.status(err.status || 500);
        res.status(500).send({
            error: err,
            message: "Server error"
        });
    });
module.exports = config;