const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

module.exports = {
    save_user,
    check_availability
}

async function save_user(params) {
    params.password = bcrypt.hashSync(params.password, 10);
    let user = await new User(params).save();
    return user;
}

async function check_availability(params) {
    let search_query = {};
    search_query[params.search_field] = params.search_value;

    let user = await User.find(search_query);
    if(user) {
        return false;
    }
    return true;
}