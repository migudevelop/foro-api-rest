'use strict';
const express = require('express');
const ROUTES = require('../constants/routes/user.json');
const UserController = require('../controllers/user');

const router = express.Router();
const mdAuth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const mdUpload = multipart({ uploadDir: './uploads/users' });

router.post(ROUTES.REGISTER, UserController.save);
router.post(ROUTES.LOGIN, UserController.login);
router.put(ROUTES.UPDATE, mdAuth.authenticated, UserController.update);
router.post(ROUTES.UPLOAD_AVATAR, [mdUpload, mdAuth.authenticated], UserController.uploadAvatar);
router.get(ROUTES.GET_AVATAR, mdAuth.authenticated, UserController.avatar);

module.exports = router;
