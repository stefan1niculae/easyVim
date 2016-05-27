"use strict";

const express = require('express');
const router = express.Router();

var Chapter = require("./models/chapter").model;
var Lesson = require("./models/lesson").model;

const EditorTheme = require('./models/editorTheme').model;
const Promise = require('bluebird');
const User = require('./models/user');  // TODO remove


const logger = require("log4js").getDefaultLogger();

router.route('/badges')
    .get(function (req, res) {
        // Badge.find({}, function (err, badges) {
        //     if (!err) {
        //         res.json(badges);
        //     }
        // })
    })
    .post(function (req, res) {
        // var badge = new Badge();
        //
        // badge.experience = req.body.experience;
        //
        // badge.save(function (err, elem) {
        //     if (!err) {
        //         res.json({_id: elem._id, message: 'Badge created'});
        //     }
        //     else {
        //         res.send(err)
        //     }
        // });

    });

router.route('/cheat-sheet')
    .get(function (req, res) {
        // Cheat.find({}, function (err, cheatSheet) {
        //     if (!err) {
        //         res.json(cheatSheet);
        //     }
        // })
    })
    .post(function (req, res) {
        // var cheat = new Cheat(req.body);
        //
        // cheat.save(function (err, elem) {
        //     if (!err) {
        //         res.json({_id: elem._id, message: 'Cheat created'});
        //     }
        //     else {
        //         res.send(err)
        //     }
        // });

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

router.route('/chapter')
    .get(function (req, res) {
        Chapter.find({}, function (err, chapters) {
            if (!err) {
                res.json(chapters);
                // var promises = [];
                // chapters = chapters.map(function (elem) {
                //     return elem.toObject();
                // });
                
                // chapters.forEach(function (chapter) {
                //     chapter.lessons = [];
                //     const promise = Lesson.find({chapter: this})
                //         .then(function (lessons) {
                //             console.log("LESSONS FOR CHAPTER: ", lessons);
                //             chapter.lessons = lessons;
                //             return lessons;
                //         });
                //     promises.push(promise);
                // });
                // Promise.all(promises).then(function () {
                //     res.json(chapters);
                // });
            }
        })
    });

router.route('/test')
    .get(function (req, res) {

        res.json('');
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


router.route('/user/currentTheme')
    .put(function (req, res) {
        console.log("REQUEST", req.user, req.body);
        let currentUser = {};

        User.findOne(req.user)
            .then(function (user) {
                currentUser = user;
                return EditorTheme.findOne(req.body)

            })
            .then(function (theme) {
                console.log("USER", currentUser, currentUser.currentTheme, theme)
                currentUser.currentTheme = theme;
                return currentUser.save();
            })
            .then(function () {
                res.status(200).send({});
            })
            .catch(function (err) {
                console.log("ERROR", err);
                res.status(500).json(err)
            })

    });


router.route('/chapter')
    .get(function (req, res) {
        Chapter.find({}, function (err, chapters) {
            if (!err) {
                var promises = [];
                chapters = chapters.map(function (elem) {
                    return elem.toObject();
                });

                chapters.forEach(function (chapter) {
                    chapter.lessoons = [];
                    const promise = Lesson.$where(`this.chapter.name === ${chapter.name}`)
                        .then(function (lessons) {
                            chapter.lessons = lessons;
                            console.log("INTRA AII DAR SUUGE PULA", chapter)
                            return lessons;
                        });
                    promises.push(promise);
                });
                Promise.all(promises).then(function () {
                    console.log("CHAPTER", chapters[0])
                    res.json(chapters);
                });
            }
        })
    });


module.exports = router;