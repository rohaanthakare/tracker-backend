const MasterView = require('./models/masterview.model');

module.exports = {
    get_view_by,
    create_view
}

async function get_view_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let view_config = await MasterView.find(search_query);
    return view_config;
}

async function create_view(params) {
    if(params.parentView === '') {
        delete params.parentView;
    } else {
        let search_query = {
            search_key: 'viewCode',
            search_value: params.parentConfig 
        };
        let parentViewConfig = await get_view_by(search_query);
        params.parentView = parentViewConfig[0]._id;
    }

    let view_config = await new MasterView(params).save();
    return view_config;
}