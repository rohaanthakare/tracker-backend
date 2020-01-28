const UserTransaction = require('./models/usertransaction.model');
const AccountTransaction = require('./models/accounttransaction.model');
const FinancialAccount = require('./models/financial-account.model');
const MasterDataDao = require('../masterdata/masterdata.dao');
const HelperService = require('../global/helper.service');

module.exports = {
    createNewTransaction,
    revertTransaction
}

async function createNewTransaction(params) {
    try {
        // Create user transaction
        let userTrans = await new UserTransaction(params).save();
        // If account present create account transaction and update account balance
        if (params.account) {
            let accountTrans = await new AccountTransaction(params).save();
            if (accountTrans) {
                let account = await FinancialAccount.updateAccountBalance(params.account, params.transactionAmount, params.transactionType);
            }
            await UserTransaction.findByIdAndUpdate(userTrans._id, {
                $push: {
                    accountTransactions: [accountTrans._id]
                }
            })
        }
        // If Contact present create contact transaction and update contact settlement 
        if(params.userContact) {
            let contactTransParams = {};
        }
        return userTrans;
    } catch (error) {
        throw error;
    }
}

async function revertTransaction(userTransId, current_user) {
    try {
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'REVERT');
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let userTrans = await UserTransaction.findById(userTransId).populate({
            path: 'accountTransactions'
        });

        let revertTransaction = {};
        revertTransaction.transactionCategory = transactionCategory._id;
        revertTransaction.transactionSubCategory = userTrans.transactionSubCategory;
        revertTransaction.transactionDetail = userTrans.transactionDetail;
        revertTransaction.transactionAmount = userTrans.transactionAmount;
        revertTransaction.transactionDate = userTrans.transactionDate;
        revertTransaction.user = current_user._id;
        if (userTrans.accountTransactions.length > 0 && 
            userTrans.accountTransactions[0].transactionType.equals(creditTrnsaction._id)) {
            revertTransaction.transactionType = debitTrnsaction._id;
        } else {
            revertTransaction.transactionType = creditTrnsaction._id;
        }
        revertTransaction.account = (userTrans.accountTransactions.length > 0) ? userTrans.accountTransactions[0].account._id: null;
        let revertedTrans = await createNewTransaction(revertTransaction);
        return revertedTrans;
    } catch (error) {
        throw error;
    }
}