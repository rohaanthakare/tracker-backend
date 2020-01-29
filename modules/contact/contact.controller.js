const GlobalEnum = require('../global/global.enumeration');
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
    try {
        req.body.user = req.current_user._id;
        req.body.title = HelperService.getMongoObjectId(req.body.title._id);
        let contact = await ContactService.createContact(req.body, req.current_user);
        res.send({
            status: true,
            contact,
            message: 'Contact created successfully'
        });
    } catch (err) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getUserContacts(req, res) {
    let contacts = await ContactService.getUserContacts(req.query, req.current_user);
    res.send(contacts);
}

async function updateContact(req, res) {
    try {
        let contact = await ContactService.updateContact(req.params.id, req.body, req.current_user);
        res.send({
            status: true,
            message:'Contact updated successfully',
            contact});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getContactDetails(req, res) {
    let contact = await ContactService.getContactDetails(req.params.id);
    res.send({
        status: true,
        contact
    });
}

async function deleteContact(req, res) {
    res.send({
        status: true,
        message: 'Inside deleteContact method'
    });
}