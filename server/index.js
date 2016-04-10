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
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


const mongoose = require('mongoose');

mongoose.connect(mongoUrl);
mongoose.connection.on('error', function (err) {
    logger.error("MongoDB connection error. Please make sure that MongoDB is running at the correct adress");
    process.exit(1);
});
mongoose.connection.once('open', function (next) {
     //cheatSheet();
     //lessons();
    logger.info('Connected to Mongo database');
});

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'photos']

    },
    function (accessToken, refreshToken, profile, done) {
        const newUser = {};
        console.log("USER", profile);

        //User.findOrCreate(..., function(err, user) {
        //    if (err) { return done(err); }
        //    done(null, user);
        //});

        done(null);
    }
));

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

app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: 'http://localhost:9000/',
        failureRedirect: 'http://localhost:9000/'
    }));

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
