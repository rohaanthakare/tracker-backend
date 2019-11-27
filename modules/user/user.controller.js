const UserService = require('./user.service');
module.exports = {
    get_users,
    register_user
}

async function get_users(req, res) {
    res.send('Inside User Controller - get_Users');
}

async function register_user(req, res) {
    let user = await UserService.save_user(req.body);
    res.send('Inside User Controller - register_user');
}