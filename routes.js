const express = require('express');
const MasterDataController = require('./modules/masterdata/masterdata.controller');
const MasterViewController = require('./modules/masterview/masterview.controller');
const RoleController = require('./modules/role/role.controller');
const UserController = require('./modules/user/user.controller');
const PasswordController = require('./modules/password/password.controller');
const ContactController = require('./modules/contact/contact.controller');
const FinanceController = require('./modules/finance/finance.controller');
const GroceryController = require('./modules/grocery/grocery.controller');

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
router.post('/activate_by_otp', UserController.activateByOtp);
router.get('/check_availability', UserController.checkAvailability);
router.post('/send_reset_pass_link', UserController.sendResetPasswordLink);
router.put('/reset_password', UserController.resetPassword);
router.get('/get_dashboard_data', UserController.getDashboardData);
router.get('/user_profile/:id', UserController.getUserProfile);
router.put('/user_profile/:id', UserController.updateUserProfile);

// Password Module API's
router.get('/get_passwords', PasswordController.getPasswords);
router.post('/create_password', PasswordController.createPassword);
router.get('/get_password/:id', PasswordController.getPasswordDetail);
router.put('/update_password/:id', PasswordController.updatePassword);

// Contacts Module API's
router.get('/get_user_contacts', ContactController.getUserContacts);
router.get('/get_contact_detail/:id', ContactController.getContactDetails);
router.post('/create_contact', ContactController.createContact);
router.put('/update_contact/:id', ContactController.updateContact);
router.get('/get_user_settlements', ContactController.getUserSettlements);

// Finance Module API's
router.post('/create_bank', FinanceController.createBank);
router.get('/banks', FinanceController.getBanks);
router.post('/create_branch', FinanceController.createBranch);
router.get('/branches', FinanceController.getBranches);
router.get('/get_financial_accounts', FinanceController.getFinancialAccounts);
router.get('/get_financial_accounts/:user_id', FinanceController.getFinancialAccountsForUser);
router.get('/get_financial_account/:id', FinanceController.getFinancialAccountDetail);
router.post('/create_financial_account', FinanceController.createFinancialAccount);
router.put('/update_financial_account/:id', FinanceController.updateFinancialAccount);
router.post('/deposit_money', FinanceController.depositMoney);
router.post('/transfer_money', FinanceController.transferMoney);
router.post('/add_expense', FinanceController.addExpense);
router.post('/add_investment', FinanceController.addInvestment);
router.get('/get_passbook', FinanceController.getUserTransactions);
router.put('/revert_transaction/:id', FinanceController.revertTransaction);
router.get('/get_contact_transactions/:contact_id', FinanceController.getContactTransactions);
router.post('/create_financial_profile', FinanceController.createFinancialProfile);
router.get('/get_financial_profile', FinanceController.getFinancialProfile);
router.put('/update_financial_profile/:id', FinanceController.updateFinancialProfile);

// Grocery Module API's
router.get('/grocery_items', GroceryController.getGroceries);
router.get('/grocery_item/:id', GroceryController.getItemDetails);
router.post('/grocery_item', GroceryController.createGroceryItems);
router.put('/grocery_item/:id', GroceryController.updateGroceryItem);
router.delete('/grocery_item/:id', GroceryController.deleteGroceryItem);
router.get('/out_of_stock_items', GroceryController.getMyGroceryList);
router.get('/send_grocery_list', GroceryController.sendGroceriesList);
router.put('/refill_grocery', GroceryController.refillGrocery);


module.exports = router;
module.exports.ROUTES_WIHTOUT_AUTH = ['/api/authenticate_user', '/api/register_user', '/api/activate_user', '/api/activate_by_otp',
    '/api/reset_password', '/api/send_reset_pass_link'];