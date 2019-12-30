const MasterData = require('./models/masterdata.model');

module.exports = {
    getDataByParentAndConfig,
    getDataByCode,
    getDataByParentConfig
}

async function getDataByCode(code) {
    let data = await MasterData.findOne({
        configCode: code
    });
    return data;
}

async function getDataByParentAndConfig(parentCode, configCode) {
    let parent = await getDataByCode(parentCode);
    let query = {};
    query.parentConfig = parent._id;
    query.configCode = configCode;

    let masterData = await MasterData.findOne(query);
    return masterData;
}

async function getDataByParentConfig(parentConfigCode) {
    let parent = await getDataByCode(parentConfigCode);
    if (parent) {
        let data = await MasterData.find({
            parentConfig: parent._id
        });
    
        return data;
    }

    return false;
}