'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user');
const topicRoutes = require('./routes/topic');
const commentRoutes = require('./routes/comment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure headers and CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//Add /api in start
app.use('/api', userRoutes);
app.use('/api', topicRoutes);
app.use('/api', commentRoutes);

module.exports = app;
