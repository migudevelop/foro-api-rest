'use strict';
const express = require('express');

const CommentController = require('../controllers/comment');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

router.post('/comment/topic/:topicId', mdAuth.authenticated, CommentController.add);
router.put('/comment/:commentId', mdAuth.authenticated, CommentController.update);
router.delete('/comment/:topicId/:commentId', mdAuth.authenticated, CommentController.delete);

module.exports = router;
