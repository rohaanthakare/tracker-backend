const Role = require('./models/role.model');

module.exports = {
    create_role,
    assign_permission,
    get_role_by
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