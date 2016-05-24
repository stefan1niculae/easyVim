"use strict";

const Lesson = require('../models/lesson').model;
const Chapter = require('../models/chapter').model;
const Command = require('../models/command').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

const generator = function () {
    return Command.find({})
        .then((commands) => {
            const commandModels = {};
            _.forEach(commands, function (command) {
                commandModels[command.key] = command;
            });
            return generateLessons(commandModels);
        })
};

function generateLessons(commandModels) {
    const contents = fs.readFileSync("./content/lessons by chapter.json");
    const chapters = JSON.parse(contents).chapters;

    let promisses = [];

    _.forEach(chapters, function (chapter, index) {
        const dbChapter = new Chapter({
            name: chapter.name,
            order: index + 1,
            xpAwarded: chapter.xpAwarded
        });

        promisses.push(dbChapter.save());

        _.forEach(chapter.lessons, function (lesson, index) {
            const content = fs.readFileSync("./content/lesson content/" + lesson.name.toLowerCase() + ".md", "utf-8");

            const dbLesson = new Lesson({
                name: lesson.name,
                commands: _.map(lesson.commands, function (command) {
                    if (commandModels[command] === void 0)
                        console.log(command)

                    return commandModels[command];
                }),
                condition: lesson.condition,
                chapter: dbChapter,
                order: index + 1,
                content: content
            });

            promisses.push(dbLesson.save());
        });
    });

    return Promise.all(promisses);
};

module.exports = generator;