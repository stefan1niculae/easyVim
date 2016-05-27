"use strict";

const express = require('express');
const router = express.Router();

const EditorTheme = require('./../models/editorTheme').model;
const Achievement = require('./../models/achievement').model;
const User = require('./../models/user'); 


router.route('/currentTheme')
  .put(function (req, res) {
    let currentUser = {};
    User.findOne(req.user)
      .then(function (user) {
        currentUser = user;
        return EditorTheme.findOne(req.body)
      })
      .then(function (theme) {
        currentUser.currentTheme = theme;
        return currentUser.save();
      })
      .then(function () {
        res.status(200).send({});
      })

  });

router.route('/achievements')
  .put(function (req, res) {
    let currentUser = {};
    User.findOne(req.user)
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