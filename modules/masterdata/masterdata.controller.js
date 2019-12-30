const MasterDataService = require('./masterdata.service');
const MasterDataDao = require('./masterdata.dao');

module.exports = {
    create_master_data,
    getDataByParentConfig
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