'use strict';

require("dotenv").load();

const cheatSheet = require('./migrations/cheatSheet');
const lessons = require('./migrations/lesson');

const User = require('./models/user');

const express = require('express');
const logger = require('log4js').getDefaultLogger();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectEnsureLogin = require('connect-ensure-login');


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
        User.find({facebookId: profile.id}, function (err, docs) {
            let newUser = {};
            if(docs.length) {
                newUser = docs[0];
                newUser.username = profile.displayName;
                newUser.picture = profile.photos[0].value
            }
            else {
                 newUser = new User({
                    facebookId: profile.id,
                    username: profile.displayName,
                    picture: profile.photos[0].value
                });
            }

            newUser.save(function (err, elem) {
                return done(err, elem);
            });
        })

    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


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


app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: 'http://localhost:9000/#/login'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:9000/#/cheatSheet');
    });

app.get('/auth/profile',
    connectEnsureLogin.ensureLoggedIn(
        {sendHTTPCode: true}),
    function (req, res) {
        console.log("USER", req.user);
        res.json(req.user)
    });

app.get('/auth/logout',
    connectEnsureLogin.ensureLoggedIn({sendHTTPCode: true}),
    function (req, res) {
        req.session.destroy();
        req.logout();
        res.status(401).send({
            error: '',
            message: "Not Authorized"
        });
    });

// app.use('/api', connectEnsureLogin.ensureLoggedIn(
//     {sendHTTPCode: true}), router);
app.use('/api', router);

// catch 404 and forward to error handler
//app.use(function (err, req, res, next) {
//    logger.error("Not Found", err);
//    res.status(404).send({
//        error: err,
//        message: "Not Found"
//    });
//});

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
