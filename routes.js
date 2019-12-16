const express = require('express');
const MasterDataController = require('./modules/masterdata/masterdata.controller');
const MasterViewController = require('./modules/masterview/masterview.controller');
const RoleController = require('./modules/role/role.controller');
const UserController = require('./modules/user/user.controller');

const router = express.Router();
// Master data API's
router.post('/create_master_data', MasterDataController.create_master_data);

// Master View API's 
router.post('/create_master_view', MasterViewController.create_view_config);
router.get('/get_navigation_menu', MasterViewController.getNavigationMenu);
router.get('/get_toolbar_actions/:parentView', MasterViewController.getToolbarActions);


// Role API's 
router.post('/create_role', RoleController.create_role);
router.post('/assign_permission', RoleController.assign_permission);

// User API's
router.post('/register_user', UserController.register_user);
router.get('/users', UserController.get_users);
router.post('/attach_role', UserController.attach_role);
router.post('/authenticate_user', UserController.authenticate);

module.exports = router;
module.exports.ROUTES_WIHTOUT_AUTH = ['/api/authenticate_user'];