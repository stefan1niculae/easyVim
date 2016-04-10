/**
 * Created by Razvan on 4/10/2016.
 */

const Lesson = require('../models/lesson.js');
const lessons = [];
const _ = require('lodash');

function insertLesson(title, description, startingContent, commands, completed, progress, type) {

    lessons.push({
        title: title,
        description: description,
        startingContent: startingContent,
        commands: commands,
        completed: completed,
        progress: progress,
        type: type
    });
}

const generator = function() {

    insertLesson(
        "Basic movement",
        "In the first lesson you will learn the basic movements in VIM",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        [{section: "basic movement", shortcut: "h", description: "left one character"},
            {section: "basic movement", shortcut: "j", description: "right one character"},
            {section: "basic movement", shortcut: "k", description: "down one row"},
            {section: "basic movement", shortcut: "l", description: "up one row"}],
        false,
        0,
        "navigation");

    console.log('Lessons: ', lessons);
    _.forEach(lessons, function (elem) {
        new Lesson(elem).save(function (err, elem) {
            console.log('elem', elem);
        })
    })
};

module.exports = generator;