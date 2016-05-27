"use strict";

const express = require('express');
const router = express.Router();

const EditorTheme = require('./../models/editorTheme').model;
const User = require('./../models/user'); 


router.route('/currentTheme')
  .put(function (req, res) {
    console.log("REQUEST", req.user, req.body);
    let currentUser = {};

    console.log("INTRAAA");
    
    
    User.findOne(req.user)
      .then(function (user) {
        currentUser = user;
        return EditorTheme.findOne(req.body)
      })
      .then(function (theme) {
        console.log("USER", currentUser, currentUser.currentTheme, theme);
        currentUser.currentTheme = theme;
        return currentUser.save();
      })
      .then(function () {
        res.status(200).send({});
      })

  });



module.exports = router;