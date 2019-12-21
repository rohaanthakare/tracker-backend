const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'trackermaster1912@gmail.com',
        pass: 'Tracker@1912'
    }
});

module.exports = {
    sendTrackerMail,
    sendActivationMail,
    sendResetPassLinkMail
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
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Welcome to Tracker',
        html: '<h1>Welcome to Tracker</h1><p>Hi ' +userInfo.firstName + ',</p><p>Please click below link to activate your tracker account<p>'
            + '<a href="http://localhost:4200/#/activate-user/' + userInfo._id + '">http://localhost:4200/#/activate-user/'+userInfo._id+'</a>'
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