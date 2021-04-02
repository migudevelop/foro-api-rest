'use strict';
const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const mdUpload = multipart({ uploadDir: './uploads/users' });

router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', mdAuth.authenticated, UserController.update);
router.post('/upload-avatar', [mdUpload, mdAuth.authenticated], UserController.uploadAvatar);
router.get('/avatar/:fileName', mdAuth.authenticated, UserController.avatar);
router.get('/users', mdAuth.authenticated, UserController.getUsers);
router.get('/user/:userId', mdAuth.authenticated, UserController.getUser);

module.exports = router;
