"use strict";

const express = require('express');
const router = express.Router();

const Challenge = require("./../models/challenge").model;
const ChallengeDifficulty = require("./../models/challengeDifficulty").model;
const ChallengeInvitation = require("./../models/challengeInvitation").model;
const ChallengeEntry = require("./../models/bestChallengeEntry").model;
const User = require('./../models/user').model;
const Promise = require('bluebird');

const logger = require('log4js').getDefaultLogger();

router.route('/challengeDifficulty')
    .get(function (req, res) {
        ChallengeDifficulty.find({})
            .populate('challenges')
            .exec(function (err, difficulties) {
                if (!err)
                    res.json(difficulties);
            })
    });

//todo fix this
router.route('/challengeEntry')
    .get((req, res) => {
        ChallengeEntry.find({challenge: req.param('challengeId')})
            .populate('challenges')
            .exec(function (err, entries) {
                if (!err)
                    res.json(entries);
            })

    })
    .post((req, res) => {
        ChallengeEntry.find({user: {_id: req.user.user._id}, challenge: req.body.challenge._id})
            .then((challengeEntries) => {
                logger.info('ENTRIES', challengeEntries[0])
                if (challengeEntries.length === 0) {
                    const challengeEntry = new ChallengeEntry({
                                user: req.user.user,
                                challenge: req.body.challenge._id,
                                keySequence: req.body.keySequence
                            });
                    return challengeEntry.save();
                }

                if (challengeEntries[0].keySequence.length > req.body.keySequence.length) {
                    return ChallengeEntry.update({
                        user: req.user.user,
                        challenge: req.body.challenge._id
                    }, {keySequence: req.body.keySequence});
                }
                return Promise.resolve('');
            })
            .then(() => {
                res.status(200).json({})
            })
            .catch((err) => {
                logger.error('Error post challenge entry', err)
            })

    });

router.route('/invitation')
    .get(function (req, res) {
        ChallengeInvitation.find({
                receiver: {
                    facebookId: req.user.user.facebookId
                }
            })
            .then(function (invitations) {
                res.json(invitations);
            })
    })
    .put(function (req, res) {
        Challenge.find({_id: req.body.challenge._id})
            .then((challenge) => {
                ChallengeInvitation.update({
                        receiver: req.user.user,
                        challenge: challenge
                    }, {honored: true}, {multi: true})
                    .then(() => {
                        req.user.user.xp += req.body.challenge.difficulty.completionExperience;
                        req.user.user.gold += req.body.challenge.difficulty.completionGold;
                        return User.update({_id: req.user.user._id}, {
                            xp: req.user.user.xp,
                            gold: req.user.user.gold
                        })
                    })
                    .then(() => {
                        res.status(200).json({})
                    })
                    .catch((err) => {
                        logger.error('Error put challenge invitation', err);
                    })
            })
    })
    .post(function (req, res) {
        let promises = [];
        promises.push(User.findOne({_id: req.body.sender._id}));
        promises.push(User.findOne({_id: req.body.receiver._id}));
        promises.push(Challenge.findOne({_id: req.body.challenge._id}));
        return Promise.all(promises)
            .then((arr) => {
                const invitation = new ChallengeInvitation({
                    sender: arr[0],
                    receiver: arr[1],
                    challenge: arr[2]
                });
                return invitation.save()
            })
            .then(() => {
                res.status(200).json({})
            })
            .catch((err) => {
                logger.error('Error post challenge invitation', err);
            });

        // TODO maybe? send invitation to facebook
    });

// front end needs to get:
// for the nav bar: if the user has a pending invitation on any challenge (unlocked?)
//
// list of ALL challenge difficulties
// computed from xp: list of challenges unlocked by current user (which can be attempted or send invites to friends)
// as a field of each challenge: list of all entries on this challenge (including the current user's one)
//    this will be displayed under the editor, ranked by challenge entry length
// list of invitations, which contain the sender and the challenge
//    when multiple senders on the same challenge, just put 'and 2 others'


// front end needs to send:
// on challenge complete -> send user and challenge that was completed and the key sequence
//    the back-end needs to set 'honored' on any invitations on this challenge for this user from all senders
//    and add gold and xp
// on invitation send -> send challenged friend and challenge invited to
//    the backed needs to create a new invitation entry and set it as not honored


module.exports = router;
