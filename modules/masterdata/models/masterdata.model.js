const mongoose = require('mongoose');

const MasterDataSchema = new mongoose.Schema({
    configCode: {
        type: String,
        required: true,
        unique: true
    },
    configName: String,
    parentConfig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData',
        required: false
    },
    displayOrder: Number,
    usedBy: {
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

module.exports = mongoose.model('MasterData', MasterDataSchema);