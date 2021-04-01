'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Add /api in start
app.use('/api', userRoutes);

module.exports = app;
