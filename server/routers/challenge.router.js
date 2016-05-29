"use strict";

const express = require('express');
const router = express.Router();
const _ = require('lodash');

const Challenge = require("./../models/challenge").model;
const ChallengeDifficulty = require("./../models/challengeDifficulty").model;
const ChallengeInvitation = require("./../models/challengeInvitation").model;


router.route('/challengeDifficulty')
    .get(function (req, res) {
        ChallengeDifficulty.find({})
            .populate('challenges') // TODO populate
            .exec(function (err, difficulties) {
                if (!err)
                    res.json(difficulties);
            })
    });

router.route('/invitation')
    .get(function (req, res) {
        ChallengeInvitation.find({receiver: req.user.user})
            .then(function (invitations) {
                res.json(invitations);
            })
    })
    .put(function (req, res) {
        Challenge.find({_id: req.body.challenge._id})
            .then((challenge) => {
                return ChallengeInvitation.update({
                    receiver: req.user.user,
                    challenge: challenge
                }, {honored: true}, {multi: true});
                // TODO add gold & xp
            })
            .then(() => {
                res.status(200).json({})
            })
    })
    .post(function (req, res) {
        // TODO change in req.body: find sender (user), receiver (user) and challenge
        const invitation = new ChallengeInvitation(req.body);
        invitation.save(() => {
            res.status(200).json({})
        })
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
