const mongo = require('mongodb');
module.exports = {
    getMongoObjectId
}

function getMongoObjectId(id) {
    return new mongo.ObjectId(id);
}