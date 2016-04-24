"use strict";

const Lesson = require('../models/lesson').model;
const Chapter = require('../models/chapter').model;
const _ = require('lodash');
const fs = require("fs");


const generator = function () {
    const contents = fs.readFileSync("../content/chapterized lessons.json");
    const chapters = JSON.parse(contents).chapters;

    _.forEach(chapters, function (chapter, index) {
        chapter.order = index + 1;

        const dbChapter = new Chapter(chapter)
        
        dbChapter.save(console.log);

        _.forEach(chapter.lessons, function (lesson, index) {
            lesson.order = index;
            lesson.chapter = dbChapter;
            new Lesson(lesson).save(console.log);
        });
    });


};

//generator();

module.exports = generator;