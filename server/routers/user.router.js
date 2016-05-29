"use strict";

const express = require('express');
const router = express.Router();
const facebookLib = require('../facebook');

const EditorTheme = require('./../models/editorTheme').model;

const logger = require('log4js').getDefaultLogger();

const Achievement = require('./../models/achievement').model;
const User = require('./../models/user');


router.route('/friends')
    .get(function (req, res) {
        User.find({})
            .then(function (users) {

                logger.info("USERS NUMBER", users.length);
                res.json(users);
            });
        //facebookLib.getFbData(req.user.accessToken, '/me/friends', function (response) {
        //    res.json(response);
        //})
    });

router.route('/currentTheme')
    .put(function (req, res) {
        EditorTheme.findOne(req.body)
            .then(function (theme) {

                logger.info(theme);
                req.user.user.currentTheme = theme;
                return User.findOneAndUpdate({_id: req.user.user._id}, {currentTheme: theme})
            })
            .then(function (err, doc) {
                res.status(200).send({});
            })
            .catch(function (err) {
                logger.error(err)
            })
    });

router.route('/achievements')
    .put(function (req, res) {
        let currentUser = {};
        User.findOne(req.user.user)
            .then(function (user) {
                currentUser = user;
                return Achievement.findOne(req.body)
            })
            .then(function (achievement) {
                currentUser.achievementsUnlocked.push(achievement);
                return currentUser.save();
            })
            .then(function () {
                res.status(200).send({});
            })
    });

module.exports = router;