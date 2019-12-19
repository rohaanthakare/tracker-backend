const UserService = require('./user.service');
const RoleService = require('../role/role.service');

module.exports = {
    get_users,
    register_user,
    attach_role,
    authenticate,
    activateUser
}

async function get_users(req, res) {
    res.send('Inside User Controller - get_Users');
}

async function authenticate(req, res) {
    let user = await UserService.authenticate(req.body);
    res.send(user);
}

async function register_user(req, res) {    
    let user = await UserService.save_user(req.body);
    if(user) {
        res.send({
            status: true,
            message: 'User registered successfully'
        });
    } else {
        res.send({
            status: false,
            message: 'Error while creating user, please try again'
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