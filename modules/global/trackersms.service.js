const request = require('request');

module.exports = {
    sendSMS,
    sendActivationOtp
}

const TEXTLOCAL_BASE_URL = "https://api.textlocal.in/send/?"
const TEXTLOCAL_API_SECRET = "ix46PQGXjTc-y4Fo12TA4PtCKrUcUGYvowWdFM6mEx"
const TEXTLOCAL_SENDER = "TXTLCL"

function sendActivationOtp(user) {
    const smsBody = `Hi, ${user.username} OTP for activating your Tracker Account is ${user.activation_otp}`;
    return sendSMS(user.mobileNo, smsBody);
}

function sendSMS(contact_number, sms_body){
    const smsUrl = `${TEXTLOCAL_BASE_URL}apiKey=${TEXTLOCAL_API_SECRET}&sender=${TEXTLOCAL_SENDER}&numbers=91${contact_number}&message=${encodeURI(sms_body)}`;
    return new Promise(function (resolve, reject) {
        request(smsUrl, function (error, res, body) {
            if(error){
                reject(false);
            }else if(res.statusCode == 200){
                body = JSON.parse(body);
                (body.status === 'success')? resolve(true) : reject(false);
            } else {
                reject(false);
            }
        });
    });
}