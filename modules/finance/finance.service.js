const Bank = require('./models/bank.model');
const Branch = require('./models/branch.model');
const FinancialAccount = require('./models/financial-account.model');
const FinanceDao = require('./finance.dao');


module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts
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