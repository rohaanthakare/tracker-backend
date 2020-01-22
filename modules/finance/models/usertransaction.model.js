const mongoose = require('mongoose');

const UserTransactionSchema = new mongoose.Schema({
    transactionCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    transactionSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    transactionDetail: String,
    transactionAmount: Number,
    transactionDate: Date,
    accountTransactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountTransaction'
    }],
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

module.exports = mongoose.model('UserTransaction', UserTransactionSchema);