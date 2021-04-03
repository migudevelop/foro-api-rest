'use strict';
const { validateCommentsParams } = require('../utils/validations');
const MESSAGES = require('../constants/messages/commentMessages.json');
const COMMON_MESSAGES = require('../constants/messages/commonMessages.json');
const Topic = require('../models/topic');
const path = require('path');
const fs = require('fs');

const PAGINATION_OPTIONS = {
  sort: { date: -1 },
  populate: 'user',
  limit: 5,
};

const controller = {
  add: function (req, res) {
    const topicId = req.params.topicId;
    Topic.findById(topicId).exec((err, topic) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topic) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
      if (req.body.content) {
        if (!validateCommentsParams(req.body.content)) return res.status(404).send({ message: MESSAGES.NOT_COMMENT });
        const comment = {
          user: req.user._id,
          content: req.body.content,
        };
        topic.comments.push(comment);
        topic.save((err) => {
          if (err) return res.status(500).send({ message: MESSAGES.ERROR_SAVING });
          return res.status(200).send({ success: true, topic });
        });
      }
    });
  },
  update: function (req, res) {
    const commentId = req.params.commentId;
    const params = req.body;
    if (!validateCommentsParams(params.content)) return res.status(404).send({ message: MESSAGES.NOT_COMMENT });
    Topic.findOneAndUpdate(
      { 'comments._id': commentId },
      {
        $set: {
          'comments.$.content': params.content,
        },
      },
      { new: true },
      (err, topic) => {
        if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
        if (!topic) return res.status(404).send({ message: MESSAGES.ERROR_UPDATING });
        return res.status(200).send({ success: true, topic });
      }
    );
  },
  delete: function (req, res) {
    const commentId = req.params.commentId;
    const topicId = req.params.topicId;
    Topic.findById(topicId).exec((err, topic) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topic) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
      const comment = topic.comments.id(commentId);
      if (!comment) return res.status(404).send({ message: MESSAGES.COMMENT_NOT_EXIST });
      comment.remove();
      topic.save((err) => {
        if (err) return res.status(500).send({ message: MESSAGES.ERROR_REMOVING });
        return res.status(200).send({ success: true, topic });
      });
    });
  },
};

module.exports = controller;
