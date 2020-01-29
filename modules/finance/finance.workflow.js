const UserTransaction = require('./models/usertransaction.model');
const AccountTransaction = require('./models/accounttransaction.model');
const Contact = require('../contact/models/contact.model');
const FinancialAccount = require('./models/financial-account.model');
const MasterDataDao = require('../masterdata/masterdata.dao');
const ContactTransaction = require('./models/contacttransaction.model');
const HelperService = require('../global/helper.service');

module.exports = {
    createNewTransaction,
    revertTransaction
}

async function createNewTransaction(params) {
    try {
        // Create user transaction
        let userTrans = await new UserTransaction(params).save();
        let accountTrans = {};
        let contactTrans = {};
        // If account present create account transaction and update account balance
        if (params.account) {
            accountTrans = await new AccountTransaction(params).save();
            if (accountTrans) {
                let account = await FinancialAccount.updateAccountBalance(params.account, params.transactionAmount, params.transactionType);
            }
        }
        // If Contact present create contact transaction and update contact settlement 
        if(params.userContact) {
            let contactTransParams = {};
            // Need to check on this field setting in next phase
            // contactTransParams.trans_contact
            contactTransParams.trans_user = params.user;
            contactTransParams.other_contact = params.userContact._id;
            contactTransParams.other_user = params.userContact.contact_user;
            contactTransParams.transactionType = params.transactionType;
            contactTransParams.transactionAmount =  params.transactionAmount;
            contactTrans = await new ContactTransaction(contactTransParams).save();
            let contactSettlement = await Contact.updateContactSettlement(params.transactionType, params.transactionAmount, params.userContact._id, params.user);
        }

        await UserTransaction.findByIdAndUpdate(userTrans._id, {
            $push: {
                accountTransactions: [accountTrans._id],
                contactTransaction: [contactTrans._id]
            }
        });
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