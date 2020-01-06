const Role = require('./models/role.model');

module.exports = {
    create_role,
    assign_permission,
    get_role_by,
    attachRoleToUser
}

async function create_role(params) {
    let role = await Role.find({
        roleCode: params.roleCode
    });

    if(role.length > 0) {
        return role;
    } else {
        role = await new Role(params).save();
        return role;
    }
}

async function assign_permission(params) {
    let role = await Role.findById(params.role_id);
    if (role && params.view_id) {
        role.permission.push(params.view_id);
        role = await Role.update({
            _id: role._id
        }, role);
        return role;
    }
}

async function get_role_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let role = await Role.find(search_query);
    return role;
}

async function attachRoleToUser(username, roleCode) {
    let search_query = {
        search_key: 'username',
        search_value: username 
    };
    let user = await UserService.get_user_by(search_query);
    if(user.length !== 0) {
        search_query = {
            search_key: 'roleCode',
            search_value: roleCode 
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