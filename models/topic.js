'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  content: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: 'User' },
});

const Comment = mongoose.model('Comment', CommentSchema);

const TopicSchema = Schema({
  title: String,
  content: String,
  code: String,
  password: String,
  lang: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: 'User' },
  coments: [CommentSchema],
});

module.exports = mongoose.model('Topic', TopicSchema);
