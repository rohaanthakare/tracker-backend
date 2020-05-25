const mongoose = require('mongoose');

const MasterViewSchema = new mongoose.Schema({
    viewCode: {
        unique: true,
        type: String,
        required: true
    },
    viewTitle: String,
    viewType: {
        type:String,
        enum:['create','edit','list','view','delete', 'custom']
    },
    parentView: {
        type: mongoose.Schema.Types.ObjectId
    },
    isMenu: Boolean,
    isToolbar: Boolean,
    iconClass: String,
    mobileIconClass: String,
    displayOrder: Number,
    viewRoute: String
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('MasterView', MasterViewSchema);