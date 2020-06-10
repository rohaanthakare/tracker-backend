const MasterDataService = require('./masterdata.service');
const MasterDataDao = require('./masterdata.dao');
const MasterData = require('./models/masterdata.model');
const GlobalEnum = require('../global/global.enumeration');

module.exports = {
    create_master_data,
    getDataByParentConfig,
    getAllMasterData
}

async function getDataByParentConfig(req, res) {
    let data = await MasterDataDao.getDataByParentConfig(req.query.configCode);
    if (data && data.length > 0) {
        res.send({
            status: true,
            data
        })
    } else {
        res.status(500).send({
            status: false,
            message: 'Error while fetching master data'
        })
    }
}

async function create_master_data(req, res) {
    let master_data = await MasterDataService.create_master_data(req.body);
    if (master_data) {
        res.send({
            status: true,
            master_data
        });
    }
}

async function getAllMasterData(req, res) {
    try {
        let masterdata = await MasterData.find().populate({
            path: 'parentConfig'
        });
        res.send(masterdata);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}