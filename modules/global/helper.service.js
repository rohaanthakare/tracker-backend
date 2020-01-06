const mongo = require('mongodb');
module.exports = {
    getMongoObjectId,
    isEmpty
}

function getMongoObjectId(id) {
    return new mongo.ObjectId(id);
}

function isEmpty(input) {
    if (input && input !== null && input !== undefined) {
        return false;
    }

    return true;
}