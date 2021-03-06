'use strict';
const { validateCreateUserParams, validateUserLoginParams, validateUpdateUserParams } = require('../utils/validations');
const MESSAGES = require('../constants/messages/userMessage.json');
const COMMON_MESSAGES = require('../constants/messages/commonMessages.json');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('../services/jwt');
const path = require('path');
const fs = require('fs');

const DEFAULT_DATA = { ROLE: 'ROLE_USER', IMAGE: null };
const DEFAULT_SALT = 10;
const VALID_EXTENSION = ['png', 'jpg', 'jpeg', 'gift'];
const ROUTE_UPLOAD = './uploads/users';

const controller = {
  save: function (req, res) {
    const params = req.body;
    if (!validateCreateUserParams(params)) return res.status(200).send({ message: MESSAGES.INCORRET_DATA_VALIDATION });
    let user = new User();
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = DEFAULT_DATA.ROLE;
    user.image = DEFAULT_DATA.IMAGE;

    User.findOne({ email: user.email }, (err, issetUser) => {
      if (err) return res.status(500).send({ message: MESSAGES.ERROR_CHECK_USER_EXIST });
      if (!issetUser) {
        bcrypt.hash(params.password, DEFAULT_SALT, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) return res.status(500).send({ message: MESSAGES.ERROR_SAVE_USER });
            if (!userStored) return res.status(500).send({ message: MESSAGES.ERROR_SAVE_USER });
            return res.status(200).send({ success: true, user: userStored });
          });
        });
      } else {
        return res.status(500).send({ message: MESSAGES.USER_ALRERY_REGISTERED });
      }
    });
  },
  login: function (req, res) {
    const params = req.body;
    if (!validateUserLoginParams(params)) return res.status(200).send({ message: MESSAGES.INCORRECT_DATA });

    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err) return res.status(500).send({ message: MESSAGES.ERROR_IDENTIFY });
      if (!user) return res.status(404).send({ message: MESSAGES.USER_NOT_EXIST });
      bcrypt.compare(params.password, user.password, (err, check) => {
        user.password = null;
        if (check && params.gettoken) return res.status(200).send({ token: jwt.createToken(user) });
        if (check) return res.status(200).send({ success: true, user });
        return res.status(200).send({ message: MESSAGES.INCORRECT_CREDENTIALS });
      });
    });
  },
  update: function (req, res) {
    const params = req.body;
    if (!validateUpdateUserParams(params)) return res.status(200).send({ message: MESSAGES.INCORRECT_DATA });
    delete params.password;
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) return res.status(500).send({ message: MESSAGES.ERROR_IDENTIFY });
        if (user && user.email == params.email)
          return res.status(200).send({ message: MESSAGES.ERROR_EMAIL_USER_EXIST });
        User.findOneAndUpdate({ _id: req.user._id }, params, { new: true }, (err, userUpdated) => {
          if (err || !userUpdated) return res.status(500).send({ message: MESSAGES.ERROR_UPDATING_USER });
          return res.status(200).send({ success: true, userUpdated });
        });
      });
    }
    User.findOneAndUpdate({ _id: req.user._id }, params, { new: true }, (err, userUpdated) => {
      if (err || !userUpdated) return res.status(500).send({ message: MESSAGES.ERROR_UPDATING_USER });
      return res.status(200).send({ success: true, userUpdated });
    });
  },
  uploadAvatar: function (req, res) {
    let fileName = COMMON_MESSAGES.NOT_UPLOADED_FILE;
    if (!req.files) return res.status(404).send({ message: fileName });
    const filePath = req.files.file.path;
    const fileData = path.parse(filePath);
    fileName = fileData.base;
    if (!VALID_EXTENSION.includes(fileData.ext.replace(/\./g, ''))) {
      fs.unlink(filePath, (err) => {
        return res.status(200).send({ message: COMMON_MESSAGES.NOT_VALID_EXTENSION });
      });
    } else {
      User.findByIdAndUpdate({ _id: req.user._id }, { image: fileName }, { new: true }, (err, userUpdated) => {
        if (err || !userUpdated) return res.status(500).send({ message: MESSAGES.ERROR_UPDATING_USER });
        return res.status(200).send({ success: true, userUpdated });
      });
    }
  },
  avatar: function (req, res) {
    const fileName = req.params.fileName;
    const pathFile = `${ROUTE_UPLOAD}/${fileName}`;
    fs.exists(pathFile, (exists) => {
      if (exists) return res.sendFile(path.resolve(pathFile));
      return res.status(404).send({ message: COMMON_MESSAGES.FILE_NOT_EXISTS });
    });
  },
  getUsers: function (req, res) {
    User.find().exec((err, users) => {
      if (err || !users) return res.status(404).send({ message: COMMON_MESSAGES.NO_DATA });
      return res.status(200).send({ success: true, users });
    });
  },
  getUser: function (req, res) {
    User.findById(req.params.userId).exec((err, user) => {
      if (err || !user) return res.status(404).send({ message: COMMON_MESSAGES.NO_DATA });
      return res.status(200).send({ success: true, user });
    });
  },
};

module.exports = controller;
