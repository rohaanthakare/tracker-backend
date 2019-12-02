const RoleService = require('./role.service');
const MasterViewService = require('../masterview/masterview.service');

module.exports = {
    create_role,
    assign_permission
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

async function assign_permission(req, res) {
    let search_query = {
        search_key: 'roleCode',
        search_value: req.body.roleCode 
    };
    let role = await RoleService.get_role_by(search_query);
    if(role.length !== 0) {
        search_query = {
            search_key: 'viewCode',
            search_value: req.body.viewCode 
        };
        let view = await MasterViewService.get_view_by(search_query);
        if(view.length !== 0) {
            let update_params = {
                role_id: role[0]._id,
                view_id: view[0]._id
            };

            let rolePerm = await RoleService.assign_permission(update_params);
            if(rolePerm) {
                res.send({
                    status: true,
                    message: 'Role Permission assigned successfully ',
                    rolePerm
                });
            }
        } else {
            res.send({
                status: false,
                message: 'No View found by Code - ' + req.body.viewCode
            });    
        }
    } else {
        res.send({
            status: false,
            message: 'No Role found by Role Code - ' + req.body.roleCode
        });
    }
}