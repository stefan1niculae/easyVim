'use strict';

const User = require('../models/user');
const EditorTheme = require('../models/editorTheme').model;
const Promise = require('bluebird');

let service = {};

let defaultTheme;

service.createOrUpdateUser = function (profile, token) {

    const defer = Promise.defer();

    EditorTheme.findOne({codename: 'solarized light'})
        .then(function (theme) {
            defaultTheme = theme;
            return User.find({facebookId: profile.id})
        })
        .then(function (docs) {
            console.log('USER', docs);
            
            let newUser = {};

            if (docs.length) {
                newUser = docs[0];
                newUser.name = profile.displayName;
                newUser.picture = profile.photos[0].value
            }
            else {
                newUser = new User({
                    facebookId: profile.id,
                    name: profile.displayName,
                    picture: profile.photos[0].value,
                    currentTheme: defaultTheme
                });
            }
            return newUser.save();
        })
        .then(function (usr) {
            defer.resolve(usr);
        })
        .catch(function (err) {
            defer.reject(err)
        });

    return defer.promise;
};
module.exports = service;




 
 
