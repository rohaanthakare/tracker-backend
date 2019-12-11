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
    console.log('------Inside getNavigationMenu');
    console.log(current_user);
    let role = await Role.findOne({
        roleCode: current_user.role
    }).populate({
        path: 'permission'
    });

    let finalRes = [];
    for(let index = 0; index < role.permission.length; index++) {
        let currentMenu = role.permission[index];
        console.log('-------CurrentMenu-------');
        console.log(currentMenu);
        console.log('-------Final Result-------');
        console.log(finalRes);
        if(!currentMenu.parentView) {
            finalRes.push(currentMenu);
        } else {
            for(let j = 0; j < finalRes.length; j++) {
                let currentParent = finalRes[j];
                if (currentParent._id === currentMenu.parentView) {
                    console.log('----Match Found');

                }        
            }
            // let parentEle = finalRes.find(res => res._id === currentMenu.parentView);
            // if(parentEle.items) {
            //     parentEle.items.push(currentMenu);
            // } else {
            //     parentEle.items = [];
            //     parentEle.items.push(currentMenu);
            // }
        }
    }
    return finalRes;
}