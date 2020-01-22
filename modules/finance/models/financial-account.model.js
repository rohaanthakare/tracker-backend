const mongoose = require('mongoose');

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

module.exports = mongoose.model('FinancialAccount', FinancialAccountSchema);