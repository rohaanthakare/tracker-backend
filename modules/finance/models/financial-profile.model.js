const mongoose = require('mongoose');

const FinancialProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    monthlyIncome: Number,
    budgetConfig: {
        type: Object
    },
    jointUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const FinancialProfile = mongoose.model('FinancialProfile', FinancialProfileSchema);
module.exports = FinancialProfile;