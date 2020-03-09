const mongoose = require('mongoose');
module.exports = {
    getMongoObjectId,
    isEmpty,
    convertToTitleCase
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