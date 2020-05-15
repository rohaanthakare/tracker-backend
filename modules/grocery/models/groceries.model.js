const mongoose = require('mongoose');

const GroceryItemSchema = new mongoose.Schema({
    name: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    isOutOfStock: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

GroceryItemSchema.statics.getOutOfStockGroceries = async function (user_id) {
    try {
        let groceries = await GroceryItem.find({
            user: user_id,
            isOutOfStock: true
        }).sort({
            name: 1
        });

        return groceries;
    } catch (error) {
        throw error;
    }
}

GroceryItemSchema.statics.refillGroceries = async function (itemIds) {
    try {
        let groceries = await GroceryItem.updateMany({
            _id: {
                $in: itemIds
            }
        }, {
            isOutOfStock: false
        });

        return groceries;
    } catch (error) {
        throw error;
    }
}

const GroceryItem = mongoose.model('GroceryItem', GroceryItemSchema);
module.exports = GroceryItem;