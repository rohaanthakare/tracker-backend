const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleCode: {
        type: String,
        required: true,
        unique: true
    },
    roleName: String,
    roleDesc: String,
    permission:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterView'
    }]
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Role', RoleSchema);