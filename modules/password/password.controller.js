const PasswordService = require('./password.service');

module.exports = {
    getPasswords,
    createPassword
};

async function getPasswords(req, res) {
    let response = await PasswordService.getPasswords(req.params, req.current_user);
    res.send(response);
}

async function createPassword(req, res) {
    let password = await PasswordService.createPassword(req.body, req.current_user);
    if (password) {
        res.send({
            status: true,
            password,
            message: 'Password created successfully'
        });
    } else {
        res.status(500).send({
            status: false,
            message: 'Error while creating password, please try again'
        });
    }
}