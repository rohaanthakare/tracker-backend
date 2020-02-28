const PasswordService = require('./password.service');

module.exports = {
    getPasswords,
    createPassword,
    getPasswordDetail,
    updatePassword
};

async function getPasswords(req, res) {
    let response = await PasswordService.getPasswords(req.query, req.current_user);
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

async function getPasswordDetail(req, res) {
    let password = await PasswordService.getPasswordDetail(req.params.id);
    res.send({
        status: true,
        password
    });
}

async function updatePassword(req, res) {
    try {
        let password = await PasswordService.updatePassword(req.params.id, req.body, req.current_user);
        res.send({
            status: true,
            message:'Password updated successfully',
            password});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}