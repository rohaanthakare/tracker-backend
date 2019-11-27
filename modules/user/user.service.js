const User = require('./models/User');

module.exports = {
    save_user
}

async function save_user(params) {
    console.log('---------Inside------------------');
    console.log(params);
    let user = await new User(params).save();
    return user;
}