"use strict";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_CALLBACK_URL = "http://localhost:8080/auth/facebook/callback";

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const userService = require('../services/userService');

function config(app) {

  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'name', 'gender', 'photos']

    },
    function (accessToken, refreshToken, profile, done) {
      return userService.createOrUpdateUser(profile)
        .then(function (elem) {
          done(null, elem);
        });
    }
  ));

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
  
  app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the
// session.
  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = config;