const PasswordService = require('./password.service');

module.exports = {
    getPasswords
};

async function getPasswords(req, res) {
    let response = await PasswordService.getPasswords(req.params, req.current_user);
    res.send(response);
}