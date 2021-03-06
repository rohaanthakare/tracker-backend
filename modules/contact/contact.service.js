const Contact = require('./models/contact.model');
const HelperService = require('../global/helper.service');
const User = require('../user/models/user.model');
const UserDao = require('../user/user.dao');
const UserService = require('../user/user.service');

module.exports = {
    createContact,
    getUserContacts,
    getContactDetails,
    updateContact, getUserSettlements
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
        let isTrackerUser = false;
        // Check if email is entered
        if (!HelperService.isEmpty(params.email)) {
            // Check if email exist in user
            const fields = ['emailId'];
            const fieldValues = [params.email];
            let user = await UserDao.getUserBy(fields, fieldValues);
            isTrackerUser = true;
            if (user) {
                // If exist add tracker id
                params.contact_user = user._id;
            } else {
                let newUserDetial = {};
                // Else create user as invited and update tracker id
                newUserDetial.emailId = params.email;
                newUserDetial.mobileNo = params.mobileNo;
                newUserDetial.firstName = params.firstName;
                newUserDetial.lastName = (params.lastName) ? params.lastName : '';
                newUserDetial.status = 'INVITED';
                newUserDetial.password = 'invited';
                newUserDetial.username = 'invited' + new Date().getTime();
                newUserDetial.role = 'TRACKER_USER';
                newUserDetial.invitedBy = HelperService.getDisplayName(current_user);
                let newUser = await UserService.saveUser(newUserDetial);
                params.contact_user = newUser.user._id;
            }
        }
        contact = await new Contact(params).save();
        if (isTrackerUser) {
            // create reverse contact
            let userInfo = await User.findById(current_user._id);
            let revContactParams = {};
            revContactParams.firstName = (userInfo.firstName) ? userInfo.firstName : userInfo.username;
            revContactParams.lastName = userInfo.lastName;
            revContactParams.mobileNo = userInfo.mobileNo;
            revContactParams.email = userInfo.emailId;
            revContactParams.user = contact.contact_user;
            revContactParams.contact_user = userInfo._id;
            revContactParams.revContact = contact._id;
            revContactParams.isJointUser = contact.isJointUser;
            let revContact = await new Contact(revContactParams).save();
            await Contact.findByIdAndUpdate(contact._id, {
                revContact: revContact._id
            });
        }
        return contact;
    } catch (err) {
        throw err;
    }
}

async function getUserContacts(params, current_user) {
    let query = {};
    query['user'] = current_user._id;
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

async function updateContact(id, params, current_user) {
    try {
        if (!HelperService.isEmpty(params.email)) {
            // Check if email exist in user
            const fields = ['emailId'];
            const fieldValues = [params.email];
            let user = await UserDao.getUserBy(fields, fieldValues);
            if (user) {
                // If exist add tracker id
                params.contact_tracker_id = user._id;
            } else {
                let newUserDetial = {};
                // Else create user as invited and update tracker id
                newUserDetial.emailId = params.email;
                newUserDetial.mobileNo = params.mobileNo;
                newUserDetial.firstName = params.firstName;
                newUserDetial.lastName = (params.lastName) ? params.lastName : '';
                newUserDetial.status = 'INVITED';
                newUserDetial.password = 'invited';
                newUserDetial.username = 'invited' + new Date().getTime();
                newUserDetial.role = 'TRACKER_USER';
                let newUser = await UserService.saveUser(newUserDetial);
            }
        }

        contact = await Contact.findByIdAndUpdate(id, params);
        return contact;
    } catch (error) {
        throw error;
    }
}

async function getUserSettlements(current_user) {
    try {
        let settlements = await Contact.find({
            user: current_user._id,
            $and: [{
                settlementAmount: {
                    $exists: true
                }
            }, {
                settlementAmount: {
                    $ne: 0
                }
            }, {
                isJointUser: {
                    $eq: false
                }
            }]
        }).populate({
            path: 'settlementType'
        });

        return settlements;
    } catch (err) {
        throw err;
    }
}