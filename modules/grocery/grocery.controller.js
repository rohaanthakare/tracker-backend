const GroceryItem = require('./models/groceries.model');
const Contact = require('../contact/models/contact.model');
const GlobalEnum = require('../global/global.enumeration');
const TrackerMailer = require('../global/trackermailer.service');
const HelperService = require('../global/helper.service');

module.exports = {
    getGroceries, createGroceryItems, updateGroceryItem, deleteGroceryItem, getItemDetails,
    getMyGroceryList, makeItemOutOfStock, refillGrocery, sendGroceriesList, consumeGrocery
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

async function consumeGrocery(req, res) {
    try {
        let groceries = await GroceryItem.consumeGrocery(req.body);
        res.send({
            status: true,
            message: 'Grocery updated successfully',
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
        let listString = '%0a';
        const mailParams = {};
        const groceryItems = [];
        for (let index = 0; index < itemsList.length; index++) {
            const itemNum = index + 1;
            const itemName = HelperService.convertToTitleCase(itemsList[index].name);
            listString = listString + `${itemNum}. ${itemName}%0a`;
            const newItem = {};
            newItem.srNo = index + 1;
            newItem.name = itemName;
            groceryItems.push(newItem);
        }
        const displayName = HelperService.getDisplayName(req.current_user);
        mailParams.name = displayName;
        mailParams.emailId = req.current_user.emailId;
        mailParams.groceryItems = groceryItems;
        // let mobile_number;
        // let messageText;
        // let other_user_name;
        // if (req.params.id) {
        //     let contact = await Contact.findById(req.params.id);
        //     mobile_number = contact.mobileNo;
        //     other_user_name = HelperService.convertToTitleCase(contact.firstName) + ' ' + HelperService.convertToTitleCase(contact.lastName);
        //     messageText = `Grocery list shared with your contact`;
        // } else {
        //     mobile_number = req.current_user.mobileNo;
        //     messageText = 'Grocery list sent to your registered mobile number';
        // }
        // let params = {
        //     name: displayName,
        //     list: listString,
        //     mobileNo: mobile_number,
        //     otherUserName: other_user_name
        // };
        await TrackerMailer.sendGroceryListMail(mailParams);
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