const MasterView = require('./models/masterview.model');
const Role = require('../role/models/role.model');

module.exports = {
    get_view_by,
    create_view,
    getNavigationMenu
}

async function get_view_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let view_config = await MasterView.find(search_query);
    return view_config;
}

async function get_view_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let view_config = await MasterView.find(search_query);
    return view_config;
}

async function create_view(params) {
    let view_config = await MasterView.findOne({
        viewCode: params.viewCode
    });
    if (!view_config) {
        if(params.parentView === '') {
            delete params.parentView;
        } else {
            let search_query = {
                search_key: 'viewCode',
                search_value: params.parentView 
            };
            let parentViewConfig = await get_view_by(search_query);
            params.parentView = parentViewConfig[0]._id;
        }
    
        view_config = await new MasterView(params).save();
    }
    
    return view_config;
}

async function getNavigationMenu(current_user) {
    let role = await Role.findOne({
        roleCode: current_user.role
    }).populate('permission');

    let userPermissions = [];
    userPermissions = Array.from(role.permission);
    let finalRes = [];
    for(let index = 0; index < userPermissions.length; index++) {
        let currentView = userPermissions[index].toJSON();
        if(!currentView.parentView) {
            finalRes.push(currentView);
        } else {
            finalRes.forEach((res) => {
                if(res._id.equals(currentView.parentView)) {
                    if (res.items) {
                        res.items.push(currentView);
                    } else {
                        res.items = [];
                        res.items.push(currentView);
                    }
                }
            });
        }
    }
    return finalRes;
}