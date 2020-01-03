const Bank = require('./models/bank.model');

module.exports = {
    createBank
}

async function createBank(params) {
    try {
        let bank = await new Bank(params).save();
        return bank;
    } catch (error) {
        throw (typeof error === 'string') ? error : 'Internal server error, please try again'
    }
}