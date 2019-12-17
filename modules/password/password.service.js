const Password = require('./models/password.model');

module.exports = {
    getPasswords
}

async function getPasswords(params, current_user) {
    let query = {};
    query['user_id'] = current_user._id;

    let recCount = await Password.find(query).count();
    let passwords;
    if (params.start && params.limit) {        
        passwords = await Password.find(query).skip(params.start).limit(params.limit);
    } else {
        passwords = await Password.find(query);
    }

    return {
        count: recCount,
        data: passwords
    };
}