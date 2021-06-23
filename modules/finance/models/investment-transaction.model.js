const mongoose = require('mongoose');

InvestmentTransactionSchema = new mongoose.Schema({
    investment: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investment'
    },
    transactionAmount: Number,
    transactionDate: Date,
    description: String,
    transactionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('InvestmentTransaction', InvestmentTransactionSchema);