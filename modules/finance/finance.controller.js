const GlobalEnum = require('../global/global.enumeration');
const FinanceService = require('./finance.service');
module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts
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

async function getBanks(req, res) {
    try {
        let banks = await FinanceService.getBanks(req.body);
        res.send({
            status: true,
            banks
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

async function getBranches(req, res) {
    try {
        let branches = await FinanceService.getBranches(req.body);
        res.send({
            status: true,
            branches
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialAccounts(req, res) {
    try {
        let accounts = await FinanceService.getFinancialAccounts(req.body, req.current_user);
        res.send(accounts);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}