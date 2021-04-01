'use strict';
const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', mdAuth.authenticated, UserController.update);

module.exports = router;
