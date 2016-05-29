"use strict";

const express = require('express');
const router = express.Router();

const Command = require("./../models/command").model;
const CommandSection = require("./../models/commandSection").model;

router.route('/command')
    .get(function (req, res) {
        Command.find({}, function (err, commands) {
            if(!err) {
                res.json(commands);
            }
        })
    });

router.route('/commandSection')
    .get(function (req, res) {
        CommandSection.find({})
            .populate('commands')
            .exec(function (err, commandSection) {
                console.log(err);
                if(!err) {
                    res.json(commandSection);
                }
            })
    });

module.exports = router;