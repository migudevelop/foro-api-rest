'use strict';
const express = require('express');
const TopicController = require('../controllers/topic');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const mdUpload = multipart({ uploadDir: './uploads/topic' });

router.post('/topic', mdAuth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);

module.exports = router;
