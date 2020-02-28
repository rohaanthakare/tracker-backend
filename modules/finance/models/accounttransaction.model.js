const mongoose = require('mongoose');

AccountTransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FinancialAccount'
    },
    transactionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    transactionDate: Date,
    transactionAmount: Number,
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

module.exports = mongoose.model('AccountTransaction', AccountTransactionSchema);