'use strict';
const express = require('express');
const TopicController = require('../controllers/topic');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

router.post('/topic', mdAuth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);
router.put('/topic/:id', mdAuth.authenticated, TopicController.update);
router.delete('/topic/:id', mdAuth.authenticated, TopicController.delete);
router.get('/search/:search', TopicController.search);

module.exports = router;
