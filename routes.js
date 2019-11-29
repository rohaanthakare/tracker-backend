const express = require('express');
const MasterDataController = require('./modules/masterdata/masterdata.controller');
const UserController = require('./modules/user/user.controller');

const router = express.Router();
// Master data API's
router.post('/create_master_data', MasterDataController.create_master_data);
// User API's
router.post('/register_user', UserController.register_user);
router.get('/users', UserController.get_users);
router.get('/get_user', function (req, res){
    res.send('Hurryyy Inside get_user route of backend server');
});

module.exports = router;