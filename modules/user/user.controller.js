const UserService = require('./user.service');
const RoleService = require('../role/role.service');
const TrackerMailer = require('../global/trackermailer.service');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

module.exports = {
    get_users,
    registerUser,
    attach_role,
    authenticate,
    activateUser,
    checkAvailability,
    sendResetPasswordLink,
    resetPassword
}

async function get_users(req, res) {
    res.send('Inside User Controller - get_Users');
}

async function authenticate(req, res) {
    try {
        let user = await UserService.authenticate(req.body);
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error, please try again'
        });
    }
}

async function registerUser(req, res) {    
    let response = await UserService.saveUser(req.body);
    if(response.status) {
        res.send({
            status: true,
            message: 'User registered successfully'
        });
    } else {
        res.status(500).send({
            status: false,
            message: response.message
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
        TrackerMailer.sendResetPassLinkMail(user[0]);
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