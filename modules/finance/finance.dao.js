const Bank = require('./models/bank.model');

module.exports = {
    getBankByCode
}

async function getBankByCode(code) {
    try {
        let bank = await Bank.findOne({
            bankCode: code
        });
        if (!bank) {
            throw 'Bank does not exist with Bank Code - ' + code;
        }
        return bank;
    } catch (error) {
        throw error;
    }
}