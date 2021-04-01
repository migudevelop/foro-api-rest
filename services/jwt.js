'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');
const CONFIG = require('../configs/configToken.json');

exports.createToken = ({ _id, name, surname, email, role, image }) => {
  const payload = {
    _id: _id,
    name: name,
    surname: surname,
    email: email,
    role: role,
    image: image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix(),
  };

  return jwt.encode(payload, CONFIG.KEY);
};
