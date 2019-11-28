const express = require('express');
const UserController = require('./modules/user/user.controller');

const router = express.Router();
// User API's
router.post('/register_user', UserController.register_user);
router.get('/users', UserController.get_users);

module.exports = router;