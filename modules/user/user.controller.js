const UserService = require('./user.service');
const RoleService = require('../role/role.service');
const TrackerMailer = require('../global/trackermailer.service');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');
const GlobalEnum = require('../global/global.enumeration');
const FinanceService = require('../finance/finance.service');
const HelperService = require('../global/helper.service');

module.exports = {
    get_users,
    registerUser,
    attach_role,
    authenticate,
    activateUser,
    activateByOtp,
    checkAvailability,
    sendResetPasswordLink,
    resetPassword,
    getDashboardData
}

async function get_users(req, res) {
    res.send('Inside User Controller - get_Users');
}

async function authenticate(req, res) {
    try {
        let user = await UserService.authenticate(req.body);
        res.send(user);
    } catch (err) {
        let errorMsg = (typeof err === 'string') ? err : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function activateByOtp(req, res) {
    try {
        let user = await UserService.activateByOtp(req.body);
        if (user) {
            res.send({
                status: true,
                message: 'User activated successfully',
                user
            });
        }
    } catch (err) {
        let errorMsg = (typeof err === 'string') ? err : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function registerUser(req, res) {
    try {
        let user = await UserService.saveUser(req.body);
        res.send({
            status: true,
            message: 'User registered successfully, activation link sent on registered email.',
            user
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function attach_role(req, res) {
    let search_query = {
        search_key: 'username',
        search_value: req.body.username 
    };
    let user = await UserService.get_user_by(search_query);
    if(user.length !== 0) {
        search_query = {
            search_key: 'roleCode',
            search_value: req.body.roleCode 
        };
        let role = await RoleService.get_role_by(search_query);
        if(role.length !== 0) {
            updateParams = {
                user_id: user[0]._id,
                role_id: role[0]._id
            }
            let user_role = await UserService.attach_role(updateParams);
            res.send({
                status: true,
                message: 'User role updated successfully - ',
                user_role
            });
        } else {
            res.send({
                status: false,
                message: 'No Role found by Role Code - ' + req.body.roleCode
            });    
        }
    } else {
        res.send({
            status: false,
            message: 'No User found by Username - ' + req.body.username
        });
    }
}

async function activateUser(req, res) {   
    let user = await UserService.activateUser(req.body.id);
    if (user) {
        res.send({
            status: true,
            message: 'User activated successfully',
            user
        });
    } else {
        res.status(500).send({
            status: false,
            message: 'Error while activating User, please try again'
        });
    }
}

async function checkAvailability(req, res) {
    let isAvailable = await UserService.checkAvailability(req.body);
    if (isAvailable) {
        res.send({
            status: true,
            message: req.body.search_field + ' is available' 
        });
    } else {
        res.send({
            status: false,
            message: req.body.search_field + ' is not available' 
        });
    }
}

async function sendResetPasswordLink(req, res) {
    let searchQry = {
        search_key: 'emailId',
        search_value: req.body.emailId
    };

    let user = await UserService.get_user_by(searchQry);
    if (user.length > 0) {
        let userInfo = user[0];
        if (userInfo.firstName) {
            userInfo.displayName = HelperService.convertToTitleCase(userInfo.firstName);
        } else {
            userInfo.displayName = HelperService.convertToTitleCase(userInfo.username);
        }
        await TrackerMailer.sendResetPassLinkMail(userInfo);
        res.send({
            status: true,
            message: 'Reset password link sent to your Email, please follow the instructions.'
        });
    } else {
        res.status(500).send({
            status: false,
            message: 'Email entered does not exist on tracker'
        });
    }
}

async function resetPassword(req, res) {
    let user = await User.findById(req.body.userId);
    if (user) {
        user.password = bcrypt.hashSync(req.body.password, 10);
        let newUser = await User.updateOne({
            _id: user._id
        }, user);
        if (newUser) {
            res.send({
                status: true,
                message: 'Password reset successfull, please login.'
            });
        }
    } else {
        res.status(500).send({
            status: false,
            message: 'Internal server error, please try again'
        })
    }
}

async function getDashboardData(req, res) {
    try {
        let accounts = await FinanceService.getFinancialAccounts(req.current_user._id);
        let expenseSplit = await FinanceService.getMonthlyExpenseSplit(req.current_user._id);
        let expenseHistory = await FinanceService.getExpenseHistory(req.current_user._id);
        let settlements = await FinanceService.getTotalSettlements(req.current_user._id);
        let financeProfile = await FinanceService.getFinancialProfile(req.current_user._id);
        res.send({
            status: true,
            message: 'Dashboard data fetched successfully',
            accounts: accounts.data,
            expenseSplit,
            expenseHistory,
            settlements,
            financeProfile
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}