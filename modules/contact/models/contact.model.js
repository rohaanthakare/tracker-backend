const mongoose = require('mongoose');

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
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    contact_tracker_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;