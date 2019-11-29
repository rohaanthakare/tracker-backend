const MasterDataService = require('./masterdata.service');

module.exports = {
    create_master_data
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