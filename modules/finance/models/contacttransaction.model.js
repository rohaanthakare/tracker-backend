const mongoose = require('mongoose');

const ContactTransactionSchema = new mongoose.Schema({
    from_contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    transactionAmount: Number
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const ContactTransaction = mongoose.model('ContactTransaction', ContactTransactionSchema);
module.exports = ContactTransaction;