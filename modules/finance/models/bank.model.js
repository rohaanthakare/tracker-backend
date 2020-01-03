const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    bankCode: {
        type: String,
        required: true,
        unique: true
    },
    bankName: String,
    bankLogo: String
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Bank', BankSchema);