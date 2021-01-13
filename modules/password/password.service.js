const Password = require('./models/password.model');
const Cryptr = require('cryptr');
const GlobalConfig = require('../../configs/global.config');
const TrackerCryptr = new Cryptr(GlobalConfig.token_secret);

module.exports = {
    getPasswords,
    createPassword,
    getPasswordDetail,
    updatePassword,
    deletePassword
}

async function getPasswords(params, current_user) {
    let query = {};
    query['user'] = current_user._id;
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
    params.user = current_user._id;
    params.password = TrackerCryptr.encrypt(params.password);
    let password = Password.createPassword(params);
    return password;
}

async function getPasswordDetail(id) {
    let password = await Password.findById(id);
    password.password = TrackerCryptr.decrypt(password.password);
    return password;
}

async function updatePassword(id, params) {
    try {
        params.password = TrackerCryptr.encrypt(params.password);
        let password = await Password.findByIdAndUpdate(id, params);
        return password;
    } catch (error) {
        throw error;
    }
}

async function deletePassword(id) {
    try {
        let password = await Password.findByIdAndDelete(id);
        return password;
    } catch (error) {
        throw error;
    }
}