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

        promises.push(dbSection.save());

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
                section: dbSection
            });

            promises.push(dbCommand.save());
        })
    });

    return Promise.all(promises);
};

module.exports = generator;