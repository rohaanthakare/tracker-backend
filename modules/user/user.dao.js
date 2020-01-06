const User = require('./models/user.model');

module.exports = {
    getUserBy,
    getUsersBy
}

async function getUserBy(fields, values) {
    let query = {};
    for (let index = 0; index < fields.length; index++) {
        query[fields[index]] = values[index];
    }

    let user = await User.findOne(query);
    return user;
}

async function getUsersBy(field, value) {
    
}