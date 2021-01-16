const GroceryItem = require('./models/groceries.model');
module.exports = {
    getOutOfStockItemsCount,
    getOutOfStockItems
}

async function getOutOfStockItemsCount(userId) {
    try {
        let itemCount = GroceryItem.find({
            user: userId,
            isOutOfStock: true
        }).count();
        return itemCount;
    } catch (error) {
        throw error;
    }
}

async function getOutOfStockItems(user_id) {
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