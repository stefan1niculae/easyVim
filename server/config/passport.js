"use strict";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;


const connectEnsureLogin = require('connect-ensure-login');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');

const getAuthRoutes = () => {
  const router = require('express').Router();
  
  router.get('/auth/facebook', passport.authenticate('facebook'));

  router.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: 'http://localhost:9000/#/login'}),
          function (req, res) {
            // Successful authentication, redirect home.
            console.log("AUTHENTICATION CALLBACK", req);
            res.redirect('http://localhost:9000/#/cheatSheet');
          });

  router.get('/auth/profile',
          connectEnsureLogin.ensureLoggedIn(
            {sendHTTPCode: true}),
          function (req, res) {
            console.log("USER", req.user);
            res.json(req.user)
          });

  router.get('/auth/logout',
          connectEnsureLogin.ensureLoggedIn({sendHTTPCode: true}),
          function (req, res) {
            req.session.destroy();
            req.logout();
            res.status(401).send({
                                   error: '',
                                   message: "Not Authorized"
                                 });
          });
  
  return router;
  
};

const getPassport = () => {
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'name', 'gender', 'photos']

    },
    function (accessToken, refreshToken, profile, done) {
      console.log("USER LOGGED In", profile);

      User.find({facebookId: profile.id}, function (err, docs) {
        let newUser = {};
        if (docs.length) {
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
          
          console.log("INTRA SAVE DB", err, elem);
          
          
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

  return passport;
};

module.exports = {

  getPassport: getPassport,
  
  getAuthRoutes: getAuthRoutes
  
  
};