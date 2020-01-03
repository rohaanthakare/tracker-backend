const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    firstName: String,
    middleName: String,
    lastName: String,
    dateOfBirth: Date,
    gender:{
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', UserSchema);