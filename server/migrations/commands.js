"use strict";

const Command = require('../models/command').model;
const CommandSection = require('../models/commandSection').model;
const _ = require('lodash');
const fs = require("fs");
const Promise = require('bluebird');

let promises = [];

const generator = function () {
    const contents = fs.readFileSync("./content/commands by section.json");
    const sections = JSON.parse(contents).sections;

    _.forEach(sections, function (section, index) {
        
        const dbSection = new CommandSection({
            name: section.name,
            order: index + 1,
            extraInfo: "TODO"
        });
        let currentCommands = [];

        _.forEach(section.commands, function (command, index) {
            const key = Object.keys(command)[0];

            if(key === '_extraInfo'){
                return;
            }

            const description = command[key];

            const dbCommand = new Command({
                key: key,
                description: description,
                order: index + 1,
                section: dbSection._id
            });

            currentCommands.push(dbCommand);

            promises.push(dbCommand.save());
        });
        dbSection.commands = _.map(currentCommands, function (elem) {
            return elem._id;
        });

        promises.push(dbSection.save());

    });

    return Promise.all(promises);
};

module.exports = generator;