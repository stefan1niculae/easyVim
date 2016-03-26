'use strict';

require("dotenv").load();

const express = require('express');
const app = express();
const port = process.env.PORT;

const users = require('./mvc/controllers/users');

app.get('/', function (req, res) {
  res.send('Hello World')
});


app.use('/users', users);

app.listen(port);


console.log('Server listening on port ' + port);