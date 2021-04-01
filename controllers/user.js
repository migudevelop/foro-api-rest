'use strict';
const { validateCreateUserParams, validateUserLoginParams } = require('../utils/validations');
const MESSAGES = require('../constants/usermessage.json');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('../services/jwt');

const DEFAULT_DATA = { ROLE: 'ROLE_USER', IMAGE: null };
const DEFAULT_SALT = 10;

const controller = {
  save: function (req, res) {
    const params = req.body;
    if (!validateCreateUserParams(params))
      return res
        .status(200)
        .send({ message: 'La validación de los datos de usuario es incorrecta, intentelo de nuevo.' });
    let user = new User();
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = DEFAULT_DATA.ROLE;
    user.image = DEFAULT_DATA.IMAGE;

    User.findOne({ email: user.email }, (err, issetUser) => {
      if (err) return res.status(500).send({ message: 'Error al compobar duplicidad de usuario.' });
      if (!issetUser) {
        bcrypt.hash(params.password, DEFAULT_SALT, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });
            if (!userStored) return res.status(500).send({ message: 'Error al guardar el usuario' });
            return res.status(200).send({ success: true, user: userStored });
          });
        });
      } else {
        return res.status(500).send({ message: 'El usuario ya esta registrado' });
      }
    });
  },
  login: function (req, res) {
    const params = req.body;
    if (!validateUserLoginParams(params))
      return res.status(200).send({ message: 'Los datos son incorrectos, intentelo de nuevo.' });

    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err) return res.status(500).send({ message: 'Error al intentar identificarse.' });
      if (!user) return res.status(404).send({ message: MESSAGES.USER_NOR_EXIST });
      bcrypt.compare(params.password, user.password, (err, check) => {
        user.password = null;
        if (check && params.gettoken) return res.status(200).send({ token: jwt.createToken(user) });
        if (check) return res.status(200).send({ success: true, user });
        return res.status(200).send({ message: 'Las credenciales no son correctas' });
      });
    });
  },
};

module.exports = controller;
