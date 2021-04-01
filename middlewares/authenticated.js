'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');
const MESSAGES = require('../constants/commenMessages.json');
const CONFIG = require('../configs/configToken.json');

exports.authenticated = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send({ message: MESSAGES.UNAUTHORIZED_REQUEST });
  const token = req.headers.authorization.replace(/['"]+/g, '');
  let payload = null;
  try {
    payload = jwt.decode(token, CONFIG.KEY);
    if (payload.exp <= moment().unix()) return res.status(401).send({ message: MESSAGES.TOKEN_EXPIRED });
  } catch (ex) {
    return res.status(403).send({ message: MESSAGES.NOT_VALID_TOKEN });
  }
  console.log(payload);
  req.user = payload;
  next();
};
