'use strict';

require("dotenv").load();

const PORT = process.env.PORT;

const express = require('express');
const logger = require('log4js').getDefaultLogger();

const app = express();

require('./configs/db.config')();
require('./configs/auth.config')(app);
require('./configs/server.config')(app);


app.on('error', function (err) {
    logger.error('Express error', err);
});

app.listen(PORT);

logger.info("Server listening at port " + PORT);
