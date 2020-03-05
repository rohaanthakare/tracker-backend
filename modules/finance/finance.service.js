const Bank = require('./models/bank.model');
const Branch = require('./models/branch.model');
const FinancialAccount = require('./models/financial-account.model');
const UserTransaction = require('./models/usertransaction.model');
const ContactTransaction = require('./models/contacttransaction.model');
const FinanceDao = require('./finance.dao');
const MasterDataDao = require('../masterdata/masterdata.dao');

module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts, createFinancialAccount, updateFinancialAccount, getFinancialAccountDetail,
    getUserTransctions, getContactTransactions
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

async function getFinancialAccountDetail(id, current_user) {
    try {
        let account = await FinancialAccount.findById(id).populate({
            path: 'branch'
        }).populate({
            path: 'bank'
        }).populate({
            path: 'accountType'
        });
        return account;
    } catch (error) {
        throw error;
    }
}

async function getUserTransctions(params, current_user) {
    try {
        let query = {};
        query['user'] = current_user._id;
        let recCount = await UserTransaction.find(query).count();
        let transactions;
        if (params.start && params.limit) {        
            transactions = await UserTransaction.find({
                user: current_user._id
            }).populate({
                path: 'transactionCategory'
            }).populate({
                path: 'transactionSubCategory'
            }).populate({
                path: 'accountTransactions',
                populate: [{
                    path: 'account'
                }, {
                    path: 'transactionType'
                }]
            }).populate({
                path: 'contactTransactions',
                populate: {
                    path: 'other_contact'
                }
            }).sort({
                transactionDate: -1
            }).skip(parseInt(params.start)).limit(parseInt(params.limit));
        } else {
            transactions = await UserTransaction.find({
                user: current_user._id
            }).populate({
                path: 'transactionCategory'
            }).populate({
                path: 'transactionSubCategory'
            }).populate({
                path: 'accountTransactions',
                populate: [{
                    path: 'account'
                }, {
                    path: 'transactionType'
                }]
            }).populate({
                path: 'contactTransactions',
                populate: {
                    path: 'other_contact'
                }
            }).sort({
                transactionDate: -1
            });
        }

        return {
            count: recCount,
            data: transactions
        };
    } catch (error) {
        throw error;
    }
}

async function getContactTransactions(conatct_id, current_user) {
    try {
        let contactTrans = await ContactTransaction.find({
            other_contact: conatct_id
        }).select('_id');
        
        const contactTransIds = [];
        for(let index = 0; index < contactTrans.length; index++) {
            contactTransIds.push(contactTrans[index]._id);
        }
        let transactions = await UserTransaction.find({
            contactTransactions: {
                $in: contactTransIds
            }
        }).populate({
            path: 'transactionCategory'
        }).populate({
            path: 'transactionSubCategory'
        }).populate({
            path: 'accountTransactions',
            populate: [{
                path: 'account'
            }, {
                path: 'transactionType'
            }]
        }).populate({
            path: 'contactTransactions',
            populate: {
                path: 'other_contact'
            }
        }).sort({
            transactionDate: -1
        });
        return transactions; 
    } catch (error) {
        throw error;
    }
}