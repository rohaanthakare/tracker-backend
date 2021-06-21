const mongoose = require('mongoose');

InvestmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    investmentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    startedOn: Date,
    maturedOn: Date,
    investmentAmount: Number,
    maturityAmount: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: Boolean
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Investment', InvestmentSchema);