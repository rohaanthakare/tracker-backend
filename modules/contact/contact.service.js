const Contact = require('./models/contact.model');
const HelperService = require('../global/helper.service');
const UserDao = require('../user/user.dao');
const UserService = require('../user/user.service');

module.exports = {
    createContact,
    getUserContacts,
    getContactDetails
}

async function getContactDetails(id) {
    let contact = await Contact.findById(id);
    return contact;
}

async function createContact(params, current_user) {
    try {
        let contact;
        // Check if email is entered
        if (!HelperService.isEmpty(params.email)) {
            // Check if email exist in user
            const fields = ['emailId'];
            const fieldValues = [params.email];
            let user = UserDao.getUserBy(fields, fieldValues);
            if (user) {
                // If exist add tracker id
                params.contact_tracker_id = user._id;
            } else {
                // Else create user as invited and update tracker id
                user.emailId = params.email;
                user.mobileNo = params.mobileNo;
                user.firstName = params.firstName;
                user.lastName = (params.lastName) ? params.lastName : '';
                user.userStatus = 'INVITED';
                user.password = 'invited';
                user.username = 'invited' + new Date().getTime();
                let newUser = await UserService.saveUser(user);
            }
        }

        contact = await new Contact(params).save();
        return contact;
    } catch (err) {
        throw err;
    }
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