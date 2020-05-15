const GroceryItem = require('./models/groceries.model');
const GlobalEnum = require('../global/global.enumeration');
const TrackerSMS = require('../global/trackersms.service');
const HelperService = require('../global/helper.service');

module.exports = {
    getGroceries, createGroceryItems, updateGroceryItem, deleteGroceryItem, getItemDetails,
    getMyGroceryList, makeItemOutOfStock, refillGrocery, sendGroceriesList
}

async function getGroceries(req, res) {
    try {
        let groceries = await GroceryItem.find({
            user: req.current_user._id
        }).populate({
            path: 'category'
        }).sort({
            name: 1
        });
        res.send({
            status: true,
            message: 'Groceries list fetched successfully',
            groceries
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createGroceryItems(req, res) {
    try {
        let params = req.body;
        params.user = req.current_user._id;
        let groceryItem = await new GroceryItem(params).save();
        res.send({
            status: true,
            message: 'Grocery item created and added to your list',
            groceryItem
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function updateGroceryItem(req, res) {
    try {
        let params = req.body;
        let item = await GroceryItem.findByIdAndUpdate(req.params.id, params);
        res.send({
            status: true,
            message: 'Grocery item updated successfully',
            item
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function deleteGroceryItem(req, res) {
    try {
        res.send({
            status: true,
            message: 'Inside deleteGroceryItem'
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getItemDetails(req, res) {
    try {
        let item = await GroceryItem.findById(req.params.id).populate({
            path: 'category'
        });
        res.send({
            status: true,
            message: 'Grocery item details fetched successfully',
            item
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getMyGroceryList(req, res) {
    try {
        let groceries = await GroceryItem.getOutOfStockGroceries(req.current_user._id);
        res.send({
            status: true,
            message: 'My Grocery list fetched successfully',
            groceries
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function makeItemOutOfStock(req, res) {
    try {
        res.send({
            status: true,
            message: 'Inside makeItemOutOfStock'
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function refillGrocery(req, res) {
    try {
        let groceries = await GroceryItem.refillGroceries(req.body);
        res.send({
            status: true,
            message: 'Grocery refilled successfully',
            groceries
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function sendGroceriesList(req, res) {
    try {
        let itemsList = await GroceryItem.getOutOfStockGroceries(req.current_user._id);
        let listString = '';
        for (let index = 0; index < itemsList.length; index++) {
            const itemNum = index + 1;
            listString = listString + `${itemNum}. ${itemsList[index].name}%0a`; 
        }
        const displayName = HelperService.getDisplayName(req.current_user);
        let params = {
            name: displayName,
            list: listString,
            mobileNo: req.current_user.mobileNo
        };
        await TrackerSMS.sendGroceryList(params);
        res.send({
            status: true,
            message: 'Grocery list sent to your registered mobile number.'
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}