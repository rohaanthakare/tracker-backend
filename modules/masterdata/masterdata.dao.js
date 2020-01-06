const MasterData = require('./models/masterdata.model');

module.exports = {
    getDataByParentAndConfig,
    getDataByCode,
    getDataByParentConfig
}

async function getDataByCode(code) {
    try {
        let data = await MasterData.findOne({
            configCode: code
        });
        return data;
    } catch (err) {
        throw err;
    }
}

async function getDataByParentAndConfig(parentCode, configCode) {
    try {
        let parent = await getDataByCode(parentCode);
        let query = {};
        query.parentConfig = parent._id;
        query.configCode = configCode;

        let masterData = await MasterData.findOne(query);
        return masterData;
    } catch (error) {
        throw error;
    }
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