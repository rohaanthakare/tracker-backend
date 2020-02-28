const mongoose = require('mongoose');
const MasterDataDao = require('../../masterdata/masterdata.dao');

const FinancialAccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    accountNumber: Number,
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    balance: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

FinancialAccountSchema.statics.updateAccountBalance = async function (accountId, transactionAmount, transactionTypeId) {
    try {
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let account = await this.findById(accountId);
        if (transactionTypeId.equals(creditTrnsaction._id)) {
            account.balance = account.balance + transactionAmount;
        } else if (transactionTypeId.equals(debitTrnsaction._id)) {
            account.balance = account.balance - transactionAmount;
        }
        account = await this.findByIdAndUpdate(account._id, {
            $set: {
                balance: account.balance
            }
        });
        return account;
    } catch (error) {
        throw error;
    }
}

FinancialAccount = mongoose.model('FinancialAccount', FinancialAccountSchema);

module.exports = FinancialAccount;