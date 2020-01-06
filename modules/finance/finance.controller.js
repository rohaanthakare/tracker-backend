const GlobalEnum = require('../global/global.enumeration');
const FinanceService = require('./finance.service');
module.exports = {
    createBank,
    createBranch
}

async function createBank(req, res) {
    try {
        let bank = await FinanceService.createBank(req.body);
        res.send({
            message: 'Bank created successfully',
            bank
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createBranch(req, res) {
    try {
        let bank = await FinanceService.createBranch(req.body);
        res.send({
            message: 'Branch created successfully',
            bank
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}