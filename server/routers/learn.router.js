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
        Chapter.find({})
          .populate('lessons')
          .exec(function (err, chapters){
              if (!err){
                  res.json(chapters);
              }
          })
    });

router.route('/lesson')
  .get(function (req, res) {
      Chapter.find({})
        .populate('chapter')
        .exec(function (err, chapters){
            if (!err){
                res.json(chapters);
            }
        })
  });



module.exports = router;