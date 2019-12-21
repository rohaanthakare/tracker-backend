const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const HelperService = require('../global/helper.service');
const config = require('../../configs/global.config');
const User = require('./models/user.model');
const RoleDao = require('../role/role.dao');
const MasterDataDao = require('../masterdata/masterdata.dao');
const TrackerMailer = require('../global/trackermailer.service');

module.exports = {
    saveUser,
    checkAvailability,
    get_user_by,
    attach_role,
    authenticate,
    activateUser,
    updateUser
}

async function saveUser(params) {
    let searchQry = {
        search_key: 'username',
        search_value: params.username
    };
    let user = await get_user_by(searchQry);
    if (user.length > 0) {
        return {
            status: false,
            message: 'Username already exist please enter other username'
        }
    }

    searchQry = {
        search_key: 'emailId',
        search_value: params.emailId
    };
    user = await get_user_by(searchQry);
    if (user.length > 0) {
        return {
            status: false,
            message: 'Email-Id already registered on tracker.'
        }
    }

    searchQry = {
        search_key: 'mobileNo',
        search_value: params.mobileNo
    };
    user = await get_user_by(searchQry);
    if (user.length > 0) {
        return {
            status: false,
            message: 'Mobile number is regitered on tracker.'
        }
    }

    let role = await RoleDao.getRoleByRoleCode(params.role);
    params.role = role[0]._id;
    let user_status = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', params.userStatus);
    params.user_status = user_status._id;
    params.password = bcrypt.hashSync(params.password, 10);
    user = await new User(params).save();
    await TrackerMailer.sendActivationMail(user);
    return {
        status: true,
        user
    };
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
    let search_query = {
        search_key: 'username',
        search_value: params.username 
    };
    let user = await get_user_by(search_query);
    let userStatusInvited = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'INVITED');
    if(user.length === 0 || user[0].user_status.equals(userStatusInvited._id)) {
        return {
            status: false,
            message: 'User does not exist, please register'
        };
    } else {
        let userStatusNew = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'NEW');
        if (user[0].user_status.equals(userStatusNew._id)) {
            return {
                status: false,
                message: 'Your account is not yet activated, please verify your account'
            };
        } else if (bcrypt.compareSync(params.password, user[0].password)) {
            let user_info = await User.findById(user[0]._id).populate({path: 'role'});
            let user_data = _.pick(user_info,['_id','username', 'emailId', 'mobileNo', 'role.roleCode']);
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
}

async function activateUser(user_id) {
    let userStatusActive = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'ACTIVE');
    user_id = HelperService.getMongoObjectId(user_id);
    let user = await User.findByIdAndUpdate(user_id, {
        user_status: userStatusActive._id
    }, {
        new: true,
        upsert: true
    });
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