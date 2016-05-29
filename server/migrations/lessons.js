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

    let promises = [];

    _.forEach(chapters, function (chapter, index) {
        let promiseLessons = [];

        const dbChapter = new Chapter({
            name: chapter.name,
            order: index + 1,
            xpAwarded: chapter.xpAwarded,
            goldAwarded: chapter.goldAwarded
        });

        _.forEach(chapter.lessons, function (lesson, index) {
            const content = fs.readFileSync("./content/lesson content/" + lesson.name.toLowerCase() + ".md", "utf-8");

            const dbLesson = new Lesson({
                name: lesson.name,
                commands: _.map(lesson.commands, function (command) {
                    if (commandModels[command] === void 0)
                        console.log(command);

                    return commandModels[command];
                }),
                condition: lesson.condition,
                order: index + 1,
                content: content,
                chapter: dbChapter._id
            });

            dbChapter.lessons.push(dbLesson._id);
            promiseLessons.push(dbLesson.save());
        });

        const dbChapterPromise = Promise.all(promiseLessons)
          .then(function () {
              return dbChapter.save();
          });

        promises.push(dbChapterPromise);

    });

    return Promise.all(promises);
}

module.exports = generator;