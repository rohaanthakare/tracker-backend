const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    username: String,
    siteLink: String,
    password: {
        type: String,
        required: true
    },
    user_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Password = mongoose.model('Password', PasswordSchema);
module.exports = Password;