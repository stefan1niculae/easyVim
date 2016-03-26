"use strict";

const express = require('express');
const router = express.Router();

router.get('/badges', function (req, res) {
    res.json(['badge1', 'badge2']);
});

//router.get('/cheetsheet', function (req, res) {
//    res.json();
//});


//router.get("" + baseUrl, authLib.authenticate, function (req, res) {
//    log4js.info("Get all agencies");
//    return store.find()
//        .then(function (reply) {
//            log4js.info("Agencies were successfully retrieved");
//            return res.status(200).send(reply);
//        }).catch(function (error) {
//            log4js.error("Error getting all agencies: ", error);
//            return res.status(500).send({
//                error: error,
//                message: "Server error!!!"
//            });
//        });
//});

module.exports = router;