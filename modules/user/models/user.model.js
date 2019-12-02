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
    userStatus: {
        type: mongoose.Schema.Types.ObjectId
    } 
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', UserSchema);