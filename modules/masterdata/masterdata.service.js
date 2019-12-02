const MasterData = require('./models/masterdata.model');
module.exports = {
    create_master_data,
    get_master_data_by
}

async function get_master_data_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let master_data = await MasterData.find(search_query);
    return master_data;
}

async function create_master_data(params) {
    let master_data = await MasterData.findOne({
        configCode: params.configCode
    });

    if(!master_data) {
        if(params.parentConfig === '') {
            delete params.parentConfig;
        } else {
            let search_query = {
                search_key: 'configCode',
                search_value: params.parentConfig 
            };
            let parentMasterData = await get_master_data_by(search_query);
            params.parentConfig = parentMasterData[0]._id;
        }
        let master_data = await new MasterData(params).save();
    }
    return master_data;
} 