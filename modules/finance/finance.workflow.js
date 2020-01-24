const UserTransaction = require('./models/usertransaction.model');

module.exports = {
    createNewTransaction,
    revertTransaction
}

async function createNewTransaction(params) {
    try {
        // Create user transaction
        console.log('----------Inside create new transaction-------');
        console.log(params);
        let userTrans = await new UserTransaction(params).save();
        // If account present create account transaction and update account balance
        // If Contact present create contact transaction and update contact settlement 
        return 'Transaction created successfully';
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