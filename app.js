'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user');
const topicRoutes = require('./routes/topic');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Add /api in start
app.use('/api', userRoutes);
app.use('/api', topicRoutes);

module.exports = app;
