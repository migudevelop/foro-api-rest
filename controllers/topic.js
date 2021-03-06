'use strict';
const { validateCreateTopicParams, validatePageParams } = require('../utils/validations');
const MESSAGES = require('../constants/messages/topicMessage.json');
const COMMON_MESSAGES = require('../constants/messages/commonMessages.json');
const Topic = require('../models/topic');

const PAGINATION_OPTIONS = {
  sort: { date: -1 },
  populate: 'user',
  limit: 5,
};

const controller = {
  save: function (req, res) {
    const params = req.body;
    if (!validateCreateTopicParams(params))
      return res.status(200).send({ message: COMMON_MESSAGES.INCORRET_DATA_VALIDATION });
    const topic = new Topic();
    topic.title = params.title;
    topic.content = params.content;
    topic.code = params.code;
    topic.lang = params.lang;
    topic.user = req.user._id;
    topic.save((err, topicStored) => {
      if (err || !topicStored) return res.status(500).send({ message: MESSAGES.ERROR_SAVING });

      return res.status(200).send({ success: true, topic: topicStored });
    });
  },
  getTopics: function (req, res) {
    let page = null;
    validatePageParams(req.params.page) ? (page = 1) : (page = parseInt(req.params.page, 10));
    Topic.paginate({}, { ...PAGINATION_OPTIONS, page }, (err, topics) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topics) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
      return res
        .status(200)
        .send({ status: true, topics: topics.docs, totalDocs: topics.totalDocs, totalPages: topics.totalPages });
    });
  },
  getTopicsByUser: function (req, res) {
    const userId = req.params.user;
    Topic.find({ user: userId })
      .sort([['date', 'descending']])
      .exec((err, topics) => {
        if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
        if (!topics) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
        return res.status(200).send({ success: true, topics });
      });
  },
  getTopic: function (req, res) {
    const topicId = req.params.id;
    Topic.findById(topicId)
      .populate('user')
      .exec((err, topics) => {
        if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
        if (!topics) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
        return res.status(200).send({ success: true, topics });
      });
  },
  update: function (req, res) {
    const topicId = req.params.id;
    const params = req.body;
    if (!validateCreateTopicParams(params))
      return res.status(200).send({ message: COMMON_MESSAGES.INCORRET_DATA_VALIDATION });
    const update = {
      title: params.title,
      content: params.content,
      code: params.code,
      lang: params.title,
    };
    Topic.findOneAndUpdate({ _id: topicId, user: req.user._id }, update, { new: true }, (err, topic) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topic) return res.status(404).send({ message: MESSAGES.ERROR_UPDATING });
      return res.status(200).send({ success: true, topic });
    });
  },
  delete: function (req, res) {
    const topicId = req.params.id;
    Topic.findOneAndDelete({ _id: topicId, user: req.user._id }, (err, topic) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topic) return res.status(404).send({ message: MESSAGES.ERROR_REMOVING });
      return res.status(200).send({ success: true, topic });
    });
  },
  search: function (req, res) {
    const searchString = req.params.search;
    Topic.find({
      $or: [
        { title: { $regex: searchString, $options: 'i' } },
        { content: { $regex: searchString, $options: 'i' } },
        { code: { $regex: searchString, $options: 'i' } },
        { lang: { $regex: searchString, $options: 'i' } },
      ],
    }).exec((err, topics) => {
      if (err) return res.status(500).send({ message: COMMON_MESSAGES.FAILED_REQUEST });
      if (!topics) return res.status(404).send({ message: MESSAGES.TOPICS_NOT_EXIST });
      return res.status(200).send({ success: true, topics });
    });
  },
};

module.exports = controller;
