const Role = require('./models/role.model');

module.exports = {
    create_role
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