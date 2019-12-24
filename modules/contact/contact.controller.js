const ContactService = require('./contact.service');

module.exports = {
    createContact,
    getUserContacts,
    updateContact,
    getContactDetails,
    deleteContact
}

async function createContact(req, res) {
    res.send({
        status: true,
        message: 'Inside Create contact method'
    });
}

async function getUserContacts(req, res) {
    let contacts = await ContactService.getUserContacts(req.query, req.current_user);
    res.send(contacts);
}

async function updateContact(req, res) {
    res.send({
        status: true,
        message: 'Inside updateContact method'
    });
}

async function getContactDetails(req, res) {
    res.send({
        status: true,
        message: 'Inside getContactDetails method'
    });
}

async function deleteContact(req, res) {
    res.send({
        status: true,
        message: 'Inside deleteContact method'
    });
}