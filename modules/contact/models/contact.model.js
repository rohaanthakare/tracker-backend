const mongoose = require('mongoose');
const MasterDataDao = require('../../masterdata/masterdata.dao');

const ContactSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: String,
    lastName: String,
    mobileNo: Number,
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    contact_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    settlementAmount: Number,
    settlementType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

ContactSchema.statics.updateContactSettlement = async function (transactionType, transactionAmount, contact_id, user) {
    try {
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let moneyToGive = await MasterDataDao.getDataByParentAndConfig('SETTLEMENT_TYPE', 'MONEY_TO_GIVE');
        let moneyToTake = await MasterDataDao.getDataByParentAndConfig('SETTLEMENT_TYPE', 'MONEY_TO_TAKE');
        // Get Contact
        let contact = await this.findById(contact_id);
        let revContact = await this.findOne({
            contact_user: user,
            user: contact.contact_user
        });

        // If settlement is not present
        if(!contact.settlementType) {
            contact.settlementAmount = transactionAmount;
            revContact.settlementAmount = transactionAmount;
            if(transactionType.equals(creditTrnsaction._id)) {
                contact.settlementType = moneyToGive._id;
                revContact.settlementType = moneyToTake._id;
            } else {
                contact.settlementType = moneyToTake._id;
                revContact.settlementType = moneyToGive._id;
            }
        } else if (contact.settlementType && contact.settlementType.equals(moneyToGive._id)) {
            if(transactionType.equals(creditTrnsaction._id)) {
                contact.settlementAmount = contact.settlementAmount + transactionAmount;
                revContact.settlementAmount = contact.settlementAmount;
            } else {
                contact.settlementAmount = contact.settlementAmount - transactionAmount;
                revContact.settlementAmount = contact.settlementAmount;
                if (contact.settlementAmount < 0) {
                    contact.settlementAmount = Math.abs(contact.settlementAmount); 
                    revContact.settlementAmount = contact.settlementAmount;
                    contact.settlementType = moneyToTake._id;
                    revContact.settlementType = moneyToGive._id;
                } else {
                    contact.settlementType = moneyToGive._id;
                    revContact.settlementType = moneyToTake._id;
                }
                
            }
        } else if (contact.settlementType && contact.settlementType.equals(moneyToTake._id)) {
            if(transactionType.equals(creditTrnsaction._id)) {
                contact.settlementAmount = contact.settlementAmount - transactionAmount;
                revContact.settlementAmount = contact.settlementAmount;
                if (contact.settlementAmount < 0) {
                    contact.settlementAmount = Math.abs(contact.settlementAmount);
                    revContact.settlementAmount = contact.settlementAmount;
                    contact.settlementType = moneyToGive._id;
                    revContact.settlementType = moneyToTake._id;
                } else {
                    contact.settlementType = moneyToTake._id;
                    revContact.settlementType = moneyToGive._id;
                }
            } else {
                contact.settlementAmount = contact.settlementAmount + transactionAmount;
                revContact.settlementAmount = contact.settlementAmount;
            }
        }

        contact = await this.findByIdAndUpdate(contact._id, contact);
        await this.findByIdAndUpdate(revContact._id, revContact);
        return contact;
    } catch (err) {
        throw err;
    }
}

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;