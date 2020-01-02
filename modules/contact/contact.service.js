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
    let contact = await Contact.findById(id).populate({
        path: 'title'
    });
    return contact;
}

async function createContact(params, current_user) {
    try {
        let contact;
        // Check if email is entered
        if (!HelperService.isEmpty(params.email)) {
            console.log('------Inside If condition email entered-------');
            // Check if email exist in user
            const fields = ['emailId'];
            const fieldValues = [params.email];
            let user = await UserDao.getUserBy(fields, fieldValues);
            console.log('------Tracker User -------');
            console.log(user);
            if (user) {
                console.log('------Tracker User already exist for email-------');
                // If exist add tracker id
                params.contact_tracker_id = user._id;
            } else {
                console.log('------Create tracker user for email-------');
                let newUserDetial = {};
                // Else create user as invited and update tracker id
                newUserDetial.emailId = params.email;
                newUserDetial.mobileNo = params.mobileNo;
                newUserDetial.firstName = params.firstName;
                newUserDetial.lastName = (params.lastName) ? params.lastName : '';
                newUserDetial.userStatus = 'INVITED';
                newUserDetial.password = 'invited';
                newUserDetial.username = 'invited' + new Date().getTime();
                newUserDetial.role = 'TRACKER_USER';
                console.log('---------New User Details---------');
                console.log(newUserDetial);
                let newUser = await UserService.saveUser(newUserDetial);
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