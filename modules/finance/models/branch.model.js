const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    branchCode: {
        type: String,
        unique: true,
        required: true
    },
    branchName: String,
    branchIfsc: String,
    branchMicr: String,
    address: String,
    city: String,
    state: String,
    country: String,
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Branch', BranchSchema);