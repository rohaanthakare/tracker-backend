const mongoose = require('mongoose');
module.exports = {
    getMongoObjectId,
    isEmpty
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