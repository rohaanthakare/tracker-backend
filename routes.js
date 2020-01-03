const express = require('express');
const MasterDataController = require('./modules/masterdata/masterdata.controller');
const MasterViewController = require('./modules/masterview/masterview.controller');
const RoleController = require('./modules/role/role.controller');
const UserController = require('./modules/user/user.controller');
const PasswordController = require('./modules/password/password.controller');
const ContactController = require('./modules/contact/contact.controller');
const FinanceController = require('./modules/finance/finance.controller');

const router = express.Router();
// Master data API's
router.post('/create_master_data', MasterDataController.create_master_data);
router.get('/get_data_for_parent', MasterDataController.getDataByParentConfig);

// Master View API's 
router.post('/create_master_view', MasterViewController.create_view_config);
router.get('/get_navigation_menu', MasterViewController.getNavigationMenu);
router.get('/get_toolbar_actions/:parentView', MasterViewController.getToolbarActions);

// Role API's 
router.post('/create_role', RoleController.create_role);
router.post('/assign_permission', RoleController.assign_permission);

// User API's
router.post('/register_user', UserController.registerUser);
router.get('/users', UserController.get_users);
router.post('/attach_role', UserController.attach_role);
router.post('/authenticate_user', UserController.authenticate);
router.post('/activate_user', UserController.activateUser);
router.get('/check_availability', UserController.checkAvailability);
router.post('/send_reset_pass_link', UserController.sendResetPasswordLink);
router.put('/reset_password', UserController.resetPassword);

// Password Module API's
router.get('/get_passwords', PasswordController.getPasswords);
router.post('/create_password', PasswordController.createPassword);
router.get('/get_password/:id', PasswordController.getPasswordDetail);

// Contacts Module API's
router.get('/get_user_contacts', ContactController.getUserContacts);
router.get('/get_contact_detail/:id', ContactController.getContactDetails);
router.post('/create_contact', ContactController.createContact);

// Finance Module API's
router.post('/create_bank', FinanceController.createBank);

module.exports = router;
module.exports.ROUTES_WIHTOUT_AUTH = ['/api/authenticate_user', '/api/register_user', '/api/activate_user', '/api/reset_password'];