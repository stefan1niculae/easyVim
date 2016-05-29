"use strict";

const express = require('express');
const router = express.Router();

Promise = require('bluebird');

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');

const User = require('./../models/user');

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: 'http://localhost:9000/#/login'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:9000/#/');
    });

router.get('/profile',
    connectEnsureLogin.ensureLoggedIn(
        {sendHTTPCode: true}),
    function (req, res) {
        Promise.all([User.getLevel(req.user.user), User.getUnlockedChapters(req.user.user), User.getUnlockedDifficulties(req.user.user)])
            .then((data) => {
                req.user.user.level = data[0];
                req.user.user.unLockedChapters = data[1];
                req.user.user.unlockedDifficulties = data[2];
                res.json(req.user.user);
            });
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