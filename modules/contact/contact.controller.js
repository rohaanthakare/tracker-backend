const HelperService = require('../global/helper.service');
const ContactService = require('./contact.service');

module.exports = {
    createContact,
    getUserContacts,
    updateContact,
    getContactDetails,
    deleteContact
}

async function createContact(req, res) {
    req.body.user_id = req.current_user._id;
    req.body.title = HelperService.getMongoObjectId(req.body.title._id);
    let contact = await ContactService.createContact(req.body, req.current_user);
    res.send({
        status: true,
        contact
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