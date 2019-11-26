const express = require('express');
const UserController = require('./modules/user/user.controller');

const router = express.Router();
router.get('/users', UserController.get_users);

module.exports = router;