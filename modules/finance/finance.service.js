const Bank = require('./models/bank.model');
const Branch = require('./models/branch.model');
const FinancialAccount = require('./models/financial-account.model');
const FinanceDao = require('./finance.dao');


module.exports = {
    createBank,
    createBranch,
    getFinancialAccounts
}

async function createBank(params) {
    try {
        let bank = await new Bank(params).save();
        return bank;
    } catch (error) {
        throw (typeof error === 'string') ? error : 'Internal server error, please try again'
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