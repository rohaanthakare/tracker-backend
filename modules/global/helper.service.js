const mongoose = require('mongoose');
const _ = require('lodash');

module.exports = {
    getMongoObjectId,
    isEmpty,
    convertToTitleCase,
    generate_otp
}

function getMongoObjectId(id) {
    return mongoose.Types.ObjectId(id);
}

function isEmpty(input) {
    if (input && input !== null && input !== undefined) {
        return false;
    }

    return true;
}

function convertToTitleCase(inputStr) {
    let returnStr = '';
    if (inputStr && inputStr !== null) {
      inputStr = inputStr.toLowerCase();
      returnStr = inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
    }
    return returnStr;
}

async function generate_otp(){
    return _.random(100000, 999999);
}