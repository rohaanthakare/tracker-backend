const Password = require('./models/password.model');

module.exports = {
    getPasswords,
    createPassword,
    getPasswordDetail
}

async function getPasswords(params, current_user) {
    let query = {};
    query['user_id'] = current_user._id;
    let recCount = await Password.find(query).count();
    let passwords;
    if (params.start && params.limit) {        
        passwords = await Password.find(query).sort('name').skip(parseInt(params.start)).limit(parseInt(params.limit));
    } else {
        passwords = await Password.find(query);
    }

    return {
        count: recCount,
        data: passwords
    };
}

async function createPassword(params, current_user) {
    params.user_id = current_user._id;
    let password = Password.createPassword(params);
    return password;
}

async function getPasswordDetail(id) {
    let password = await Password.findById(id);
    return password;
}