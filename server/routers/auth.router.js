"use strict";

const express = require('express');
const router = express.Router();

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const facebookLib = require('../facebook');

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
           passport.authenticate('facebook', {failureRedirect: 'http://localhost:9000/#/login'}),
           function (req, res) {
             // Successful authentication, redirect home.
             res.redirect('http://localhost:9000/#/');
           });


router.get('/profile/friends', function (req, res) {
  facebookLib.getFbData(req.user.accessToken, '/me/friends', function (response) {

    console.log("FRIENDS", response);
    res.json(response);
  })
});

router.get('/profile',
           connectEnsureLogin.ensureLoggedIn(
             {sendHTTPCode: true}),
           function (req, res) {
             res.json(req.user.user)
           });

router.get('/logout',
           connectEnsureLogin.ensureLoggedIn({sendHTTPCode: true}),
           function (req, res) {
             req.session.destroy();
             req.logout();
             res.status(401).send({
                                    error: '',
                                    message: "Not Authorized"
                                  });
           });

module.exports = router;