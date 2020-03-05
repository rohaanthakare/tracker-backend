const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const HelperService = require('../global/helper.service');
const GlobalConfig = require('../../configs/global.config');

let transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: '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'
    }
}));

module.exports = {
    sendTrackerMail,
    sendActivationMail,
    sendResetPassLinkMail,
    sendTrackerInviteMail
}

async function sendTrackerMail() {
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: 'rohaanthakare@gmail.com',
        subject: 'Teste Templete',
        text: 'This is test mail body'
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

async function sendActivationMail(userInfo) {
    let mailParams = {};
    if (userInfo.firstName) {
        mailParams.displayName = HelperService.convertToTitleCase(userInfo.firstName);
    } else {
        mailParams.displayName = HelperService.convertToTitleCase(userInfo.username);
    }
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Welcome to Tracker',
        html: `<h1>Welcome to Tracker</h1>
            <p>Hi ${mailParams.displayName},</p>
            <p>Please click below link to activate your tracker account<p>
            <a href="${GlobalConfig.APP_URL}activate-user/${userInfo._id}">Activate</a>`
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

async function sendResetPassLinkMail(userInfo) {
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Tracker - Reset password',
        html: '<p>Hi ' +userInfo.username + ',</p><p>Please click below link to reset your tracker password<p>'
            + '<a href="http://localhost:4200/#/reset-pass/' + userInfo._id + '">http://localhost:4200/#/reset-pass/'+userInfo._id+'</a>'
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

async function sendTrackerInviteMail(userInfo) {
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Tracker Invite',
        html: '<h1>Tracker Invitation</h1><p>Hi ' +userInfo.firstName + ',</p><p>you have been invited to Tracker a personal tracker application.'
            +'Register yourself on tracker from below link<p>'
            + '<a href="http://localhost:4200/#/register">http://localhost:4200/#/register</a>'
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}