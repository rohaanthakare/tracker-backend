const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'rohanthakare1912@gmail.com',
        pass: 'Gmail@1912'
    }
});

module.exports = {
    sendTrackerMail
}

async function sendTrackerMail() {
    let mailOptions = {
        from: 'Tracker <rohanthakare1912@gmail.com>',
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