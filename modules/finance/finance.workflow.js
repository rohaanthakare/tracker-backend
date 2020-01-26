const UserTransaction = require('./models/usertransaction.model');
const AccountTransaction = require('./models/accounttransaction.model');
const FinancialAccount = require('./models/financial-account.model');

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
        return userTrans;
    } catch (error) {
        throw error;
    }
}

async function revertTransaction() {
    try {
        return 'Transaction reverted successfully';
    } catch (error) {
        throw error;
    }
}