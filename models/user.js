'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String,
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
