const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const HelperService = require('../global/helper.service');
const config = require('../../configs/global.config');
const User = require('./models/user.model');
const RoleDao = require('../role/role.dao');
const MasterDataDao = require('../masterdata/masterdata.dao');
const TrackerMailer = require('../global/trackermailer.service');
const TrackerSMS = require('../global/trackersms.service');
const FinanceService = require('../finance/finance.service');

module.exports = {
    saveUser,
    checkAvailability,
    get_user_by,
    attach_role,
    authenticate,
    activateUser,
    activateByOtp,
    updateUser, getDailyStatus
}

async function saveUser(params) {
    try {
        let invitedUserStatus = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'INVITED');
        let newUserStatus = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'NEW');
        let activeUserStatus = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'ACTIVE');
        let searchQry = {
            search_key: 'username',
            search_value: params.username
        };
        let user = await get_user_by(searchQry);
        if (user.length > 0 && user[0].status.equals(activeUserStatus._id)) {
            throw 'Username already exist please enter other username';
        } else if (user.length > 0 && user[0].status.equals(newUserStatus._id)) {
            throw 'Username already registered, but not yet activated.';
        }
    
        searchQry = {
            search_key: 'emailId',
            search_value: params.emailId
        };
        user = await get_user_by(searchQry);
        if (user.length > 0 && user[0].status.equals(activeUserStatus._id)) {
            throw 'Email-Id already registered on tracker.';
        } else if (user.length > 0 && user[0].status.equals(newUserStatus._id)) {
            throw 'Email id already registered on traker but not yet activated';
        }

        if(user.length > 0 && user[0].status.equals(invitedUserStatus._id)) {
            params.password = bcrypt.hashSync(params.password, 10);
            params.status = newUserStatus._id;
            user = await User.findByIdAndUpdate(user[0]._id, {
                status: newUserStatus._id,
                username: params.username,
                mobileNo: params.mobileNo,
                password: params.password,
                firstName: params.firstName
            }, {
                upsert: true,
                new: true
            });
        } else {
            let role = await RoleDao.getRoleByRoleCode(params.role);
            params.role = role[0]._id;
            let userStatus = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', params.status);
            params.status = userStatus._id;
            params.password = bcrypt.hashSync(params.password, 10);
            params.activation_otp = await HelperService.generate_otp();
            user = await new User(params).save();
        }
        if (params.status.equals(newUserStatus._id)) {
            await TrackerMailer.sendActivationMail(user);
            await TrackerSMS.sendActivationOtp(user);
        } else {
            await TrackerMailer.sendTrackerInviteMail(params)
        }
        return {
            status: true,
            user
        };
    } catch (error) {
        throw error;
    }
}

async function checkAvailability(params) {
    let search_query = {};
    search_query[params.search_field] = params.search_value;

    let user = await User.find(search_query);
    if(user) {
        return false;
    }
    return true;
}

async function get_user_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let user = await User.find(search_query);
    return user;
}

async function attach_role(params) {
    let user = await User.findById(params.user_id);
    if(user && params.role_id) {
        user.role = params.role_id;
        user = await User.update({
            _id: user._id
        }, user);
    }
    return user;
}

async function authenticate(params) {
    try {
        let search_query = {
            search_key: 'username',
            search_value: params.username 
        };
        let user = await get_user_by(search_query);
        let userStatusInvited = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'INVITED');
        if(user.length === 0 || user[0].status.equals(userStatusInvited._id)) {
            throw 'User does not exist, please register';
        } else {
            let userStatusNew = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'NEW');
            if (user[0].status.equals(userStatusNew._id)) {
                return {
                    status: false,
                    message: 'Your account is not yet activated, please verify your account'
                };
            } else if (bcrypt.compareSync(params.password, user[0].password)) {
                let user_info = await User.findById(user[0]._id).populate({path: 'role'});
                let user_data = _.pick(user_info,['_id','username', 'emailId', 'mobileNo', 'role.roleCode', 'firstName', 'lastName']);
                user_data.role = user_data.role.roleCode;
                const user_token = jwt.sign(user_data, config.token_secret, {
                    algorithm : "HS256",
                    expiresIn : 60*60*12
                });
                return {
                    status: true,
                    message: 'User authenticated successfully',
                    user: user_data,
                    user_token
                };  
            } else {
                return {
                    status: false,
                    message: 'Invalid Username or Password, please try again'
                };    
            }
        }
    } catch (err) {
        throw err;
    }
}

async function activateUser(user_id) {
    let userStatusActive = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'ACTIVE');
    user_id = HelperService.getMongoObjectId(user_id);
    let user = await User.findByIdAndUpdate(user_id, {
        status: userStatusActive._id
    }, {
        new: true,
        upsert: true
    });
    let mailParam = {
        emailId: user.emailId
    }
    
    await TrackerMailer.sendWelcomeMail(mailParam);
    return user;
}

async function updateUser(params, current_user) {
    let user_id = params.id;
    let user = await User.findByIdAndUpdate(user_id, params, {
        upsert: true,
        new: true
    });

    return user;
}

async function activateByOtp(params) {
    try {
        let user = await User.findById(params.id);
        if (user.activation_otp === params.user_otp) {
            await activateUser(user._id);
        } else {
            throw 'Please enter valid OTP'
        }
        return user;
    } catch (err) {
        throw err;
    }
}

async function getDailyStatus(user_id) {
    try {
        let settlements = await FinanceService.getTotalSettlements(user_id);
        let balance = await FinanceService.getTotalBalance(user_id);
        let expense = await FinanceService.getTotalMonthlyExpense(user_id);
        let transactions = await FinanceService.getTodaysTransactions(user_id);
        return {
            settlements,
            balance,
            expense,
            transactions
        };
    } catch (err) {
        throw err;
    }
}