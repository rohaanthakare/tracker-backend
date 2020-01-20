const Bank = require('./models/bank.model');
const Branch = require('./models/branch.model');
const FinancialAccount = require('./models/financial-account.model');
const FinanceDao = require('./finance.dao');
const MasterDataDao = require('../masterdata/masterdata.dao');

module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts, createFinancialAccount, updateFinancialAccount
}

async function createBank(params) {
    try {
        let bank = await new Bank(params).save();
        return bank;
    } catch (error) {
        throw error;
    }
}

async function getBanks(params, current_user) {
    try {
        let banks = await Bank.find();
        return banks;
    } catch (error) {
        throw error;
    }
}

async function createBranch(params) {
    try {
        params.bank = await FinanceDao.getBankByCode(params.bank);
        let branch = await new Branch(params).save();
        return branch;
    } catch (error) {
        throw (typeof error === 'string') ? error : 'Internal server error, please try again'
    }
}

async function getBranches(params, current_user) {
    try {
        let branches = await Branch.find();
        return branches;
    } catch (error) {
        throw error;
    }
}

async function getFinancialAccounts(params, current_user) {
    try {
        let accounts = await FinancialAccount.find({
            user: current_user._id
        });
        return {
            count: accounts.length,
            data: accounts
        };
    } catch (error) {
        throw error;
    }
}

async function createFinancialAccount(params, current_user) {
    try {
        let accountType = await MasterDataDao.getDataByParentAndConfig('ACCOUNT_TYPE', 'WALLET');
        params.user = current_user._id;
        params.accountType = params.accountType._id;      
        
        if (accountType._id.equals(params.accountType)) {
            delete params.bank;
            delete params.branch;
        } else {
            params.bank = params.bank._id;
            params.branch = params.branch._id;
        }
        let account = await new FinancialAccount(params).save();
        return account;
    } catch (error) {
        throw error;
    }
}

async function updateFinancialAccount(id, params, current_user) {
    try {
        params.user = current_user._id;
        params.accountType = params.accountType._id;
        params.bank = params.bank._id;
        params.branch = params.branch._id;
        let account = await FinancialAccount.findByIdAndUpdate(id, params);
        return account;
    } catch (error) {
        throw error;
    }
}