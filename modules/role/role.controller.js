const RoleService = require('./role.service');

module.exports = {
    create_role
};

async function create_role(req, res) {
    let role = await RoleService.create_role(req.body);
    if(role) {
        res.send({
            status: true,
            message: 'Role created successfully',
            role
        });
    } else {
        res.send({
            status: false,
            message: 'Error while creating role'
        });
    }
}