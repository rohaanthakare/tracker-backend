const Contact = require('./models/contact.model');

module.exports = {
    createContact,
    getUserContacts
}

async function createContact(params, current_user) {
    let contact;
    // Check if email is entered
    // Check if email exist in user
    // If exist add tracker id
    // Else create user as invited and update tracker id
    // if email is not given create contact

    contact = await new Contact(params).save();
    return contact;
}

async function getUserContacts(params, current_user) {
    let query = {};
    query['user_id'] = current_user._id;
    let recCount = await Contact.find(query).count();
    let contacts;
    if (params.start && params.limit) {        
        contacts = await Contact.find(query).sort('firstName').skip(parseInt(params.start)).limit(parseInt(params.limit));
    } else {
        contacts = await Contact.find(query);
    }

    return {
        count: recCount,
        data: contacts
    };
}