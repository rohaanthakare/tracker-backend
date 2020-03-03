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
        let accountTrans = [];
        let contactTrans = [];
        // If account present create account transaction and update account balance
        if (params.account) {
            let accountTransaction = await new AccountTransaction(params).save();
            if (accountTrans) {
                await FinancialAccount.updateAccountBalance(params.account, params.transactionAmount, params.transactionType);
            }
            accountTrans.push(accountTransaction._id);
        }
        if (params.fromAccount) {
            let accTransParams = {};
            accTransParams.account = params.fromAccount;
            accTransParams.transactionType = params.fromAccountTransType;
            accTransParams.transactionDate = params.transactionDate;
            accTransParams.transactionAmount = params.transactionAmount;
            accTransParams.user = params.user;
            let fromAccountTrans = await new AccountTransaction(accTransParams).save();
            if (fromAccountTrans) {
                await FinancialAccount.updateAccountBalance(accTransParams.account, accTransParams.transactionAmount, accTransParams.transactionType);
            }
            accountTrans.push(fromAccountTrans._id);
        }
        if (params.toAccount) {
            let accTransParams = {};
            accTransParams.account = params.toAccount;
            accTransParams.transactionType = params.toAccountTransType;
            accTransParams.transactionDate = params.transactionDate;
            accTransParams.transactionAmount = params.transactionAmount;
            accTransParams.user = params.user;
            let toAccountTrans = await new AccountTransaction(accTransParams).save();
            if (toAccountTrans) {
                await FinancialAccount.updateAccountBalance(accTransParams.account, accTransParams.transactionAmount, accTransParams.transactionType);
            }
            accountTrans.push(toAccountTrans._id);
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
            contactTransaction = await new ContactTransaction(contactTransParams).save();
            contactTrans.push(contactTransaction);
            await Contact.updateContactSettlement(params.transactionType, params.transactionAmount, params.userContact._id, params.user);
        }

        // Multi User Contact Expense Scenario 
        if(params.userContacts && params.userContacts.length > 0) {
            for (let index = 0; index < params.userContacts.length; index++) {
                let currentTrans = params.userContacts[index];
                let contactTransParams = {};
                // Need to check on this field setting in next phase
                // contactTransParams.trans_contact
                contactTransParams.trans_user = params.user;
                contactTransParams.other_contact = currentTrans._id;
                contactTransParams.other_user = currentTrans.contact_user;
                contactTransParams.transactionType = params.transactionType;
                contactTransParams.transactionAmount =  currentTrans.transactionAmount;
                contactTransParams.transactionHeadCount =  currentTrans.selectionCount;
                
                contactTransaction = await new ContactTransaction(contactTransParams).save();
                contactTrans.push(contactTransaction);
                await Contact.updateContactSettlement(params.transactionType, currentTrans.transactionAmount, currentTrans._id, params.user);
            }
        }

        await UserTransaction.findByIdAndUpdate(userTrans._id, {
            $push: {
                accountTransactions: accountTrans,
                contactTransactions: contactTrans
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
        }).populate({
            path: 'contactTransactions'
        });

        await UserTransaction.findByIdAndUpdate(userTransId, {
            isReverted: true
        });

        let revertTransaction = {};
        revertTransaction.transactionCategory = transactionCategory._id;
        revertTransaction.transactionSubCategory = userTrans.transactionSubCategory;
        revertTransaction.transactionDetail = userTrans.transactionDetail;
        revertTransaction.transactionAmount = userTrans.transactionAmount;
        revertTransaction.transactionDate = new Date();
        revertTransaction.user = current_user._id;
        // Single Account Transaction - Deposti, Withdraw, Expense
        if (userTrans.accountTransactions.length === 1) {
            if (userTrans.accountTransactions[0].transactionType.equals(creditTrnsaction._id)) {
                revertTransaction.transactionType = debitTrnsaction._id;
            } else {
                revertTransaction.transactionType = creditTrnsaction._id;
            }
            revertTransaction.account = userTrans.accountTransactions[0].account._id;
        }

        // Multi Account Transaction - During Transfer Money
        if (userTrans.accountTransactions.length === 2) {
            if (userTrans.accountTransactions[1].transactionType.equals(creditTrnsaction._id)) {
                revertTransaction.fromAccountTransType = debitTrnsaction._id;
            } else {
                revertTransaction.fromAccountTransType = creditTrnsaction._id;
            }
            revertTransaction.fromAccount = userTrans.accountTransactions[1].account._id;

            if (userTrans.accountTransactions[0].transactionType.equals(creditTrnsaction._id)) {
                revertTransaction.toAccountTransType = debitTrnsaction._id;
            } else {
                revertTransaction.toAccountTransType = creditTrnsaction._id;
            }
            revertTransaction.toAccount = userTrans.accountTransactions[0].account._id;
        }
        if (userTrans.contactTransactions.length > 0) {
            if(userTrans.contactTransactions.length === 1) {
                revertTransaction.userContact = (userTrans.contactTransactions.length > 0) ? userTrans.contactTransactions[0].other_contact: null;
            } else {
                revertTransaction.userContacts = [];
                for (let index = 0; index < userTrans.contactTransactions.length; index++) {
                    let currentContactTrans = userTrans.contactTransactions[index];
                    if (currentContactTrans.transactionType.equals(creditTrnsaction._id)) {
                        revertTransaction.transactionType = debitTrnsaction._id;
                    } else {
                        revertTransaction.transactionType = creditTrnsaction._id;
                    }
                    let revContactTrans = {};
                    revContactTrans._id = currentContactTrans.other_contact;
                    revContactTrans.contact_user = currentContactTrans.other_user;
                    revContactTrans.transactionAmount =  currentContactTrans.transactionAmount;
                    revContactTrans.selectionCount =  currentContactTrans.transactionHeadCount;
                    revertTransaction.userContacts.push(revContactTrans);
                }
            }
        }
        let revertedTrans = await createNewTransaction(revertTransaction);
        return revertedTrans;
    } catch (error) {
        throw error;
    }
}