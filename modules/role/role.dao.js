const Role = require('./models/role.model');

module.exports = {
    getRoleByRoleCode
}

async function getRoleByRoleCode(inputRoleCode) {
    let role = await Role.find({
        roleCode: inputRoleCode
    });

    return role;
}