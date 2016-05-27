"use strict";

const express = require('express');
const router = express.Router();

var Chapter = require("./../models/chapter").model;
var Lesson = require("./../models/lesson").model;


router.route('/lesson')
    .get(function (req, res) {
        Lesson.find({}, function (err, lessons) {
            if (!err) {
                res.json(lessons);
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
                var promises = [];
                chapters = chapters.map(function (elem) {
                    return elem.toObject();
                });

                chapters.forEach(function (chapter) {
                    chapter.lessoons = [];
                    const promise = Lesson.$where(`this.chapter.name === ${chapter.name}`)
                        .then(function (lessons) {
                            chapter.lessons = lessons;
                            return lessons;
                        });
                    promises.push(promise);
                });
                Promise.all(promises).then(function () {
                    res.json(chapters);
                });
            }
        })
    });



module.exports = router;