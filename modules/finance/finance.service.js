const Bank = require('./models/bank.model');
const Branch = require('./models/branch.model');
const FinancialAccount = require('./models/financial-account.model');
const UserTransaction = require('./models/usertransaction.model');
const ContactTransaction = require('./models/contacttransaction.model');
const Contact = require('../contact/models/contact.model');
const FinancialProfile = require('./models/financial-profile.model');
const FinanceDao = require('./finance.dao');
const MasterDataDao = require('../masterdata/masterdata.dao');
const HelperService = require('../global/helper.service');
const moment = require('moment');

module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts, createFinancialAccount, updateFinancialAccount, getFinancialAccountDetail,
    getUserTransctions, getContactTransactions, getMonthlyExpenseSplit, getExpenseHistory,
    createFinanceProfile, getFinancialProfile, updateFinancialProfile, getTotalSettlements, getTotalBalance, getTotalMonthlyExpense,
    getTodaysTransactions
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

async function getFinancialAccounts(user_id) {
    try {
        let accounts = await FinancialAccount.find({
            user: user_id
        }).populate({
            path: 'bank'
        }).populate({
            path: 'accountType'
        }).sort({
            balance: -1
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
            $or: [{ 
                other_contact: conatct_id
            }, { 
                trans_contact: conatct_id 
            }]
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
            populate: [{
                path: 'other_contact'
            }, {
                path: 'trans_contact'
            }]
        }).sort({
            transactionDate: -1
        });
        return transactions; 
    } catch (error) {
        throw error;
    }
}

async function getExpenseHistory(user_id) {
    try {
        let expenseConfig = await MasterDataDao.getDataByCode('EXPENSE');
        const expenseId = HelperService.getMongoObjectId(expenseConfig._id);
        const userId = HelperService.getMongoObjectId(user_id);
        let expenseHistory = await UserTransaction.aggregate([{
            $match: {
                user: userId,
                transactionCategory: expenseId,
                isReverted: {
                    $exists: false
                }
            }
        },
        {
            $group: {
                _id: {
                    month: {$month: "$transactionDate"},
                    year: {$year: "$transactionDate"},
                },
                total: {
                    $sum: '$transactionAmount'
                }
            }
        }]);
        return expenseHistory;
    } catch (err) {
        throw err;
    }
}

async function getMonthlyExpenseSplit(user_id) {
    try {
        const dt = new Date();
        const mnth = dt.getMonth() + 1;       
        let expenseConfig = await MasterDataDao.getDataByCode('EXPENSE');
        const expenseId = HelperService.getMongoObjectId(expenseConfig._id);
        const userId = HelperService.getMongoObjectId(user_id);
        let monthly_expense_split = await UserTransaction.aggregate([
            {
                $project: {
                    transactionSubCategory: 1,
                    transactionAmount: 1,
                    transactionCategory: 1,
                    user: 1,
                    transMonth: {
                        $month: '$transactionDate'
                    },
                    isReverted: 1
                }
            }, { 
                '$match': { 
                    user: userId, 
                    transactionCategory: expenseId,
                    transMonth: mnth,
                    isReverted: {
                        $exists: false
                    }
                }
            }, { 
                '$lookup': { 
                    from: 'masterdatas', 
                    localField: 'transactionSubCategory', 
                    foreignField: '_id', 
                    as: 'expense_type' 
                } 
            }, { 
                '$unwind': '$expense_type' 
            }, { 
                '$group': { 
                    _id: '$transactionSubCategory', 
                    expense_tps: { 
                        '$push': '$expense_type' 
                    }, 
                    total: { 
                        '$sum': '$transactionAmount' 
                    } 
                } 
            }
        ]);
        
        return monthly_expense_split;
    } catch (err) {
        throw err;
    }
}

async function getTotalSettlements(user_id) {
    try {
        const userId = HelperService.getMongoObjectId(user_id);
        let settlements = await Contact.aggregate([{
            $match: {
                user: userId,
                isJointUser: false
            }
        }, { 
            '$lookup': { 
                from: 'masterdatas', 
                localField: 'settlementType', 
                foreignField: '_id', 
                as: 'settlement_type' 
            } 
        }, { 
            '$unwind': '$settlement_type' 
        }, { 
            '$group': { 
                _id: '$settlementType', 
                settlment_tps: { 
                    '$push': '$settlement_type' 
                }, 
                total: { 
                    '$sum': '$settlementAmount' 
                } 
            } 
        }]);
        let finalSettlement = {};
        if (settlements.length === 1) {
            const key1 = settlements[0].settlment_tps[0].configCode;
            finalSettlement[key1] = settlements[0].total;
            if (key1 === 'MONEY_TO_GIVE') {
                finalSettlement['MONEY_TO_TAKE'] = 0;
            } else {
                finalSettlement['MONEY_TO_GIVE'] = 0;
            }
        } else if (settlements.length === 2){
            const key1 = settlements[0].settlment_tps[0].configCode;
            finalSettlement[key1] = settlements[0].total;
            const key2 = settlements[1].settlment_tps[0].configCode;
            finalSettlement[key2] = settlements[1].total;
        } else {
            finalSettlement['MONEY_TO_GIVE'] = 0;
            finalSettlement['MONEY_TO_TAKE'] = 0;
        }
        return finalSettlement;
    } catch (err) {
        throw err;
    }
}

async function createFinanceProfile(profile) {
    let fin_profile = await new FinancialProfile(profile).save();
    return fin_profile;
}

async function getFinancialProfile(user_id) {
    let fin_profile = await FinancialProfile.findOne({
        user: user_id
    });
    return fin_profile;
}

async function updateFinancialProfile(id, profile) {
    let fin_profile = await FinancialProfile.findByIdAndUpdate(id, profile);
    return fin_profile;
}

async function getTotalBalance(user_id) {
    try {
        let balance = await FinancialAccount.aggregate([{
            $match: {
                user: user_id
                }
        }, {
            $group: {
            _id: '$user',
            total: {
                $sum: '$balance'
            }
        }
        }]);
        return balance;
    } catch (error) {
        throw error;
    }
}

async function getTotalMonthlyExpense(user_id) {
    try {
        const dt = new Date();
        const mnth = dt.getMonth() + 1;
        let expenseConfig = await MasterDataDao.getDataByCode('EXPENSE');
        const expenseId = HelperService.getMongoObjectId(expenseConfig._id);
        let expense = await UserTransaction.aggregate([{
            $project: {
                transactionAmount: 1,
                transactionCategory: 1,
                user: 1,
                transMonth: {
                    $month: '$transactionDate'
                },
                isReverted: 1
            }
        }, {
                $match: {
                    user: user_id,
                    transactionCategory: expenseId,
                    transMonth: mnth,
                    isReverted: {
                        $exists: false
                    }
                }
            }, {
                $group: {
                    _id: '$user', 
                    total: { 
                        '$sum': '$transactionAmount' 
                    }
                }
            }]);

            return expense;
    } catch (error) {
        throw error;
    }
}

async function getTodaysTransactions(user_id) {
    try {
        const rangeStart = moment().utc().startOf('day').toDate();
        const rangeEnd = moment().utc().endOf('day').toDate();
        let trans = await UserTransaction.find({
            user: user_id,
            transactionDate: {
                $gte: rangeStart,
                $lte: rangeEnd
            }
        }).populate({
            path: 'transactionCategory'
        }).populate({
            path: 'transactionSubCategory'
        });

        return trans;
    } catch (error) {
        throw error;
    }
}