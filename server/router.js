"use strict";

const express = require('express');
const router = express.Router();
const Badge = require('./models/badge');
const Cheat = require('./models/cheat');
const Lesson = require('./models/lesson');

router.route('/badges')
    .get(function (req, res) {
        Badge.find({}, function (err, badges) {
            if (!err) {
                res.json(badges);
            }
        })
    })
    .post(function (req, res) {
        var badge = new Badge();

        badge.experience = req.body.experience;

        badge.save(function (err, elem) {
            if (!err) {
                res.json({_id: elem._id, message: 'Badge created'});
            }
            else {
                res.send(err)
            }
        });

    });

router.route('/cheat-sheet')
    .get(function (req, res) {
        Cheat.find({}, function (err, cheatSheet) {
            if (!err) {
                res.json(cheatSheet);
            }
        })
    })
    .post(function (req, res) {
        var cheat = new Cheat(req.body);

        cheat.save(function (err, elem) {
            if (!err) {
                res.json({_id: elem._id, message: 'Cheat created'});
            }
            else {
                res.send(err)
            }
        });

    });

router.route('/lesson')
    .get(function (req, res) {
        Lesson.find({}, function (err, lesson) {
            if (!err) {
                res.json(lesson);
            }
        })
    })
    .post(function (req, res) {
        var lesson = new Lesson(req.body);

        lesson.save(function (err, elem) {
            if (!err) {
                res.json({_id: elem._id, message: 'Lesson created'});
            }
            else {
                res.send(err)
            }
        });

    });

//router.get('/cheetsheet', function (req, res) {
//    res.json();
//});


//router.get("" + baseUrl, authLib.authenticate, function (req, res) {
//    log4js.info("Get all agencies");
//    return store.find()
//        .then(function (reply) {
//            log4js.info("Agencies were successfully retrieved");
//            return res.status(200).send(reply);
//        }).catch(function (error) {
//            log4js.error("Error getting all agencies: ", error);
//            return res.status(500).send({
//                error: error,
//                message: "Server error!!!"
//            });
//        });
//});

module.exports = router;