const GlobalEnum = require('../global/global.enumeration');
const FinanceService = require('./finance.service');
const FinanceWorkflow = require('./finance.workflow');
const MasterDataDao = require('../masterdata/masterdata.dao');
const HelperService = require('../global/helper.service');

module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts, createFinancialAccount, updateFinancialAccount, getFinancialAccountDetail,
    depositMoney, getUserTransactions
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

async function createFinancialAccount(req, res) {
    try {
        let account = await FinanceService.createFinancialAccount(req.body.accountDetails, req.current_user);
        res.send({
            status: true,
            message:'Financial Account created successfully',
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function updateFinancialAccount(req, res) {
    try {
        let account = await FinanceService.updateFinancialAccount(req.params.id, req.body.accountDetails, req.current_user);
        res.send({
            status: true,
            message:'Financial Account updated successfully',
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialAccountDetail(req, res) {
    try {
        let account = await FinanceService.getFinancialAccountDetail(req.params.id, req.current_user);
        res.send({
            status: true,
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function depositMoney(req, res) {
    try {
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'DEPOSIT');
        let params = req.body.transactionDetail;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.transactionSubCategory._id;
        params.user = req.current_user._id;
        params.account = params.account._id;
        params.transactionType = creditTrnsaction._id; 
        delete params.depositType;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        res.send({
            status: true,
            message: 'Money deposited successfully, please check account balance',
            transaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getUserTransactions(req, res) {
    try {
        let transactions = await FinanceService.getUserTransctions(req.query, req.current_user);
        res.send(transactions);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}