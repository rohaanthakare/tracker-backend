const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const HelperService = require('../global/helper.service');
const GlobalConfig = require('../../configs/global.config');

let transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

module.exports = {
    sendTrackerMail,
    sendActivationMail,
    sendResetPassLinkMail,
    sendTrackerInviteMail,
    sendWelcomeMail,
    getWelcomeMailMessage
}

async function sendWelcomeMail(userInfo) {
    let mailMessageHtml = getWelcomeMailMessage();
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Welcome to Tracker',
        html: mailMessageHtml,
        attachments: [{
            filename: 'footer1.jpg',
            path: 'public/images/footer1.jpg',
            cid: 'footer_logo@tmp.com'
        }, {
            filename: 'header',
            path: 'public/images/tracker_light.png',
            cid: 'header_logo@tmp.com'
        }]
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
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
    let mailMessageHtml = getRegistrationMailMessage(userInfo);
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Welcome to Tracker',
        html: mailMessageHtml,
        attachments: [{
            filename: 'header',
            path: 'public/images/tracker_light.png',
            cid: 'header_logo@tmp.com'
        }]
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

async function sendResetPassLinkMail(userInfo) {
    let mailMessageHtml = getResetPasswordMailMessage(userInfo);
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Welcome to Tracker',
        html: mailMessageHtml,
        attachments: [{
            filename: 'header',
            path: 'public/images/tracker_light.png',
            cid: 'header_logo'
        }]
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

async function sendTrackerInviteMail(userInfo) {
    let mailMessageHtml = getInviteMailMessage(userInfo);
    let mailOptions = {
        from: 'Tracker <trackermaster1912@gmail.com>',
        to: userInfo.emailId,
        subject: 'Tracker Invite',
        html: mailMessageHtml,
        attachments: [{
            filename: 'footer1.jpg',
            path: 'public/images/footer1.jpg',
            cid: 'footer_logo'
        }, {
            filename: 'header',
            path: 'public/images/tracker_light.png',
            cid: 'header_logo'
        }]
    };
    
    return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

function getWelcomeMailMessage(params) {    
    let mailMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Test</title>
        <style>
    
    
             @import url(https://fonts.googleapis.com/css?family=Roboto:300); /*Calling our web font*/
    
            /* Some resets and issue fixes */
            #outlook a { padding:0; }
            body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }     
            .ReadMsgBody { width: 100%; }
            .ExternalClass {width:100%;} 
            .backgroundTable {margin:0 auto; padding:0; width:100%;!important;} 
            table td {border-collapse: collapse;}
            .ExternalClass * {line-height: 115%;}    
            
            /* End reset */
            
            
            /* These are our tablet/medium screen media queries */
            @media screen and (max-width: 630px){
                    
                    
                /* Display block allows us to stack elements */                      
                *[class="mobile-column"] {display: block;} 
                
                /* Some more stacking elements */
                *[class="mob-column"] {float: none !important;width: 100% !important;}     
                     
                /* Hide stuff */
                *[class="hide"] {display:none !important;}          
                
                /* This sets elements to 100% width and fixes the height issues too, a god send */
                *[class="100p"] {width:100% !important; height:auto !important;}                    
                    
                /* For the 2x2 stack */            
                *[class="condensed"] {padding-bottom:40px !important; display: block;}
                
                /* Centers content on mobile */
                *[class="center"] {text-align:center !important; width:100% !important; height:auto !important;}            
                
                /* 100percent width section with 20px padding */
                *[class="100pad"] {width:100% !important; padding:20px;} 
                
                /* 100percent width section with 20px padding left & right */
                *[class="100padleftright"] {width:100% !important; padding:0 20px 0 20px;} 
                
                /* 100percent width section with 20px padding top & bottom */
                *[class="100padtopbottom"] {width:100% !important; padding:20px 0px 20px 0px;} 
                
            
            }
                
            
        </style>
        
       
    </head>
    
    
    <div style="background:#687079;">
    
    <body style="padding:0; margin:0" bgcolor="#687079">
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">
        <tr>
            <td align="center" valign="top">
            
                <table width="640" border="0" cellspacing="0" cellpadding="0" class="hide">
                    <tr>
                        <td height="20"></td>
                    </tr>
                </table>
                
                <table width="640" cellspacing="0" cellpadding="0" bgcolor="#" class="100p">
                    <tr>
                        <td background="images/header-bg.jpg" bgcolor="#3f51b5" width="640" valign="top" class="100p">
                            <!--[if gte mso 9]>
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                <v:fill type="tile" src="header-bg.jpg" color="#3b464e" />
                                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                    <![endif]-->
                                    <div>
                                        <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p">
                                            <tr>
                                                <td valign="top">
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td align="left" width="50%" class="100p"><img src="cid:header_logo@tmp.com" alt="Logo" border="0" style="display:block" height="35"/></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td height="35"></td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="color:#FFFFFF; font-size:24px;">
                                                                <font face="'Roboto', Arial, sans-serif">
                                                                    <span style="font-size:44px;">Welcome to Tracker</span><br />
                                                                    <br />
                                                                    
                                                                    <a href="http://<?php echo $mailParam['siteURL']; ?>" style="color:#FFFFFF; text-decoration:none;">
                                                                    <table border="0" cellspacing="0" cellpadding="10" style="border:2px solid #FFFFFF;">
                                                                        <tr>
                                                                            <td align="center" style="color:#FFFFFF; font-size:16px;"><font face="'Roboto', Arial, sans-serif"><a href="##" style="color:#FFFFFF; text-decoration:none;">GET STARTED</a></font></td>
                                                                        </tr>
                                                                    </table>
                                                                    </a>
                                                                </font>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="35"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <!--[if gte mso 9]>
                                </v:textbox>
                            </v:rect>
                            <![endif]-->
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p" bgcolor="#FFFFFF">
                    <tr>
                        <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" class="100padtopbottom" width="600">
                                <tr>
                                    <td align="left" class="condensed" valign="top">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" class="mob-column" width="290">
                                            <tr>
                                                <td valign="top" align="center">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td valign="top" align="center" class="100padleftright">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-inr" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                        <td width="20"></td>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-share-square" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td valign="top" class="100padleftright" align="center">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td valign="top" width="135" align="center" style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track your all Bank Accounts</font></td>
                                                                        <td width="20"></td>
                                                                        <td valign="top" width="135" align="center"  style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track your monthly Expense</font></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="20" class="hide"></td>
                                    <td align="left" class="condensed" valign="top">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" class="mob-column" width="290">
                                            <tr>
                                                <td valign="top" align="center">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td valign="top" align="center" class="100padleftright">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-unlock-alt" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                        <td width="20"></td>
                                                                        <td width="135" align="center"><a href="#">
                                                                            <i class="fa fa-handshake-o" style="font-size:35pt;color:#3F51B5"></i>
                                                                        </a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td valign="top" class="100padleftright" align="center">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td valign="top" width="135" align="center" style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track all your Passwords</font></td>
                                                                        <td width="20"></td>
                                                                        <td valign="top" width="135" align="center"  style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track settlement with friends</font></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="center"><img src="cid:footer_logo@tmp.com" class="100p" border="0" style="display:block" /></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="left" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">&copy; Tracker 2016</font></td>
                        <td align="right" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">Unsubscribe</font></td>
                    </tr>
                </table>
                <table width="640" class="100p" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="50"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
        
    </body>
    </html>`;

    return mailMessage;
}

function getRegistrationMailMessage(params) {
    let mailMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Test</title>
        <style>
    
    
             @import url(https://fonts.googleapis.com/css?family=Roboto:300); /*Calling our web font*/
    
            /* Some resets and issue fixes */
            #outlook a { padding:0; }
            body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }     
            .ReadMsgBody { width: 100%; }
            .ExternalClass {width:100%;} 
            .backgroundTable {margin:0 auto; padding:0; width:100%;!important;} 
            table td {border-collapse: collapse;}
            .ExternalClass * {line-height: 115%;}    
            
            /* End reset */
            
            
            /* These are our tablet/medium screen media queries */
            @media screen and (max-width: 630px){
                    
                    
                /* Display block allows us to stack elements */                      
                *[class="mobile-column"] {display: block;} 
                
                /* Some more stacking elements */
                *[class="mob-column"] {float: none !important;width: 100% !important;}     
                     
                /* Hide stuff */
                *[class="hide"] {display:none !important;}          
                
                /* This sets elements to 100% width and fixes the height issues too, a god send */
                *[class="100p"] {width:100% !important; height:auto !important;}                    
                    
                /* For the 2x2 stack */            
                *[class="condensed"] {padding-bottom:40px !important; display: block;}
                
                /* Centers content on mobile */
                *[class="center"] {text-align:center !important; width:100% !important; height:auto !important;}            
                
                /* 100percent width section with 20px padding */
                *[class="100pad"] {width:100% !important; padding:20px;} 
                
                /* 100percent width section with 20px padding left & right */
                *[class="100padleftright"] {width:100% !important; padding:0 20px 0 20px;} 
                
                /* 100percent width section with 20px padding top & bottom */
                *[class="100padtopbottom"] {width:100% !important; padding:20px 0px 20px 0px;} 
                
            
            }
                
            
        </style>
        
       
    </head>
    
    
    <div style="background:#687079;">
    
    <body style="padding:0; margin:0" bgcolor="#687079">
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">
        <tr>
            <td align="center" valign="top">
            
                <table width="640" border="0" cellspacing="0" cellpadding="0" class="hide">
                    <tr>
                        <td height="20"></td>
                    </tr>
                </table>
                
                <table width="640" cellspacing="0" cellpadding="0" bgcolor="#" class="100p">
                    <tr>
                        <td bgcolor="#3f51b5" width="640" valign="top" class="100p">
                            <!--[if gte mso 9]>
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                <v:fill type="tile" src="header-bg.jpg" color="#3b464e" />
                                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                    <![endif]-->
                                    <div>
                                        <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p">
                                            <tr>
                                                <td valign="top">
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td align="left" width="50%" class="100p"><img src="tracker_light.png" alt="Logo" border="0" style="display:block" height="35"/></td>
                                                            
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td align="center" style="color:#FFFFFF; font-size:24px;">
                                                                <font face="'Roboto', Arial, sans-serif">
                                                                    <span style="font-size:44px;">Just one step away</span><br />
                                                                    <br />
                                                                </font>
                                                            </td>
                                                        </tr>
    
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <!--[if gte mso 9]>
                                </v:textbox>
                            </v:rect>
                            <![endif]-->
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="100p" style="padding-top: 20px">
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">Hi ${params.displayName},</font><br></td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">You are just one step away from using Tracker, click below to confirm your registration.</font><br></td>
                    </tr>
                </table>
                <table border="0" bgcolor="#ffffff" cellspacing="0" cellpadding="0" width="640" class="100p">
                    <tr>
                        <td align="center" style="color:#FFFFFF; font-size:24px;">
                            <font face="'Roboto', Arial, sans-serif">
                                <br />
                                
                                <a href="${GlobalConfig.APP_URL}activate-user/${params._id}" style="color:#3B464E; text-decoration:none;">
                                <table border="0" cellspacing="0" cellpadding="10" style="border:2px solid #3f51b5;">
                                    <tr>
                                        <td align="center" style="color:#3f51b5; font-size:16px;"><font face="'Roboto', Arial, sans-serif"><a href="##" style="color:#3f51b5; text-decoration:none; font-weight: bold">ACTIVATE ACCOUNT</a></font></td>
                                    </tr>
                                </table>
                                </a>
                            </font>
                        </td>
                    </tr>
                    <tr>
                        <td height="35"></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="left" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">&copy; Tracker 2016</font></td>
                        <td align="right" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">Unsubscribe</font></td>
                    </tr>
                </table>
                <table width="640" class="100p" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="50"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
        
    </body>
    </html>`;

    return mailMessage;
}

function getResetPasswordMailMessage(params) {
    let mailMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Test</title>
        <style>
    
    
             @import url(https://fonts.googleapis.com/css?family=Roboto:300); /*Calling our web font*/
    
            /* Some resets and issue fixes */
            #outlook a { padding:0; }
            body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }     
            .ReadMsgBody { width: 100%; }
            .ExternalClass {width:100%;} 
            .backgroundTable {margin:0 auto; padding:0; width:100%;!important;} 
            table td {border-collapse: collapse;}
            .ExternalClass * {line-height: 115%;}    
            
            /* End reset */
            
            
            /* These are our tablet/medium screen media queries */
            @media screen and (max-width: 630px){
                    
                    
                /* Display block allows us to stack elements */                      
                *[class="mobile-column"] {display: block;} 
                
                /* Some more stacking elements */
                *[class="mob-column"] {float: none !important;width: 100% !important;}     
                     
                /* Hide stuff */
                *[class="hide"] {display:none !important;}          
                
                /* This sets elements to 100% width and fixes the height issues too, a god send */
                *[class="100p"] {width:100% !important; height:auto !important;}                    
                    
                /* For the 2x2 stack */            
                *[class="condensed"] {padding-bottom:40px !important; display: block;}
                
                /* Centers content on mobile */
                *[class="center"] {text-align:center !important; width:100% !important; height:auto !important;}            
                
                /* 100percent width section with 20px padding */
                *[class="100pad"] {width:100% !important; padding:20px;} 
                
                /* 100percent width section with 20px padding left & right */
                *[class="100padleftright"] {width:100% !important; padding:0 20px 0 20px;} 
                
                /* 100percent width section with 20px padding top & bottom */
                *[class="100padtopbottom"] {width:100% !important; padding:20px 0px 20px 0px;} 
                
            
            }
                
            
        </style>
        
       
    </head>
    
    
    <div style="background:#687079;">
    
    <body style="padding:0; margin:0" bgcolor="#687079">
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">
        <tr>
            <td align="center" valign="top">
            
                <table width="640" border="0" cellspacing="0" cellpadding="0" class="hide">
                    <tr>
                        <td height="20"></td>
                    </tr>
                </table>
                
                <table width="640" cellspacing="0" cellpadding="0" bgcolor="#" class="100p">
                    <tr>
                        <td bgcolor="#3f51b5" width="640" valign="top" class="100p">
                            <!--[if gte mso 9]>
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                <v:fill type="tile" src="header-bg.jpg" color="#3b464e" />
                                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                    <![endif]-->
                                    <div>
                                        <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p">
                                            <tr>
                                                <td valign="top">
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td align="left" width="50%" class="100p"><img src="cid:header_logo" alt="Logo" border="0" style="display:block" height="35"/></td>
                                                        </tr>
                                                    </table>                                                
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <!--[if gte mso 9]>
                                </v:textbox>
                            </v:rect>
                            <![endif]-->
                        </td>
                    </tr>
                </table>
                
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="100p" style="padding-top: 20px">
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">Hi <?php echo ucwords($mailParam['first_name'])." ".ucwords($mailParam['last_name']); ?>,</font><br></td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">We received a request to reset your Tracker password</font><br></td>
                    </tr>
                </table>
                <table border="0" bgcolor="#ffffff" cellspacing="0" cellpadding="0" width="640" class="100p">
                    <tr>
                        <td align="center" style="color:#FFFFFF; font-size:24px;">
                            <font face="'Roboto', Arial, sans-serif">
                                <br />
                                
                                <a href="${GlobalConfig.APP_URL}reset-pass/${params._id}" style="color:#3B464E; text-decoration:none;">
                                <table border="0" cellspacing="0" cellpadding="10" style="border:2px solid #3f51b5;">
                                    <tr>
                                        <td align="center" style="color:#3f51b5; font-size:16px;"><font face="'Roboto', Arial, sans-serif"><a href="##" style="color:#3f51b5; text-decoration:none; font-weight:bold">RESET PASSWORD</a></font></td>
                                    </tr>
                                </table>
                                </a>
                            </font>
                        </td>
                    </tr>
                    <tr>
                        <td height="35"></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">If you ignore this message, your password won't be changed.</font><br></td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-left: 20px;"><font face="'Roboto', Arial, sans-serif">If you didn't request a password reset, let us know</font><br></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="left" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">&copy; Tracker 2016</font></td>
                        <td align="right" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">Unsubscribe</font></td>
                    </tr>
                </table>
                <table width="640" class="100p" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="50"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
        
    </body>
    </html>`;

    return mailMessage;
}

function getInviteMailMessage(params) {
    let mailMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <script src="https://use.fontawesome.com/d8dc74c07a.js"></script>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Test</title>
        <style>
    
    
             @import url(https://fonts.googleapis.com/css?family=Roboto:300); /*Calling our web font*/
    
            /* Some resets and issue fixes */
            #outlook a { padding:0; }
            body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }     
            .ReadMsgBody { width: 100%; }
            .ExternalClass {width:100%;} 
            .backgroundTable {margin:0 auto; padding:0; width:100%;!important;} 
            table td {border-collapse: collapse;}
            .ExternalClass * {line-height: 115%;}	
            
            /* End reset */
            
            
            /* These are our tablet/medium screen media queries */
            @media screen and (max-width: 630px){
                    
                    
                /* Display block allows us to stack elements */                      
                *[class="mobile-column"] {display: block;} 
                
                /* Some more stacking elements */
                *[class="mob-column"] {float: none !important;width: 100% !important;}     
                     
                /* Hide stuff */
                *[class="hide"] {display:none !important;}          
                
                /* This sets elements to 100% width and fixes the height issues too, a god send */
                *[class="100p"] {width:100% !important; height:auto !important;}			        
                    
                /* For the 2x2 stack */			
                *[class="condensed"] {padding-bottom:40px !important; display: block;}
                
                /* Centers content on mobile */
                *[class="center"] {text-align:center !important; width:100% !important; height:auto !important;}            
                
                /* 100percent width section with 20px padding */
                *[class="100pad"] {width:100% !important; padding:20px;} 
                
                /* 100percent width section with 20px padding left & right */
                *[class="100padleftright"] {width:100% !important; padding:0 20px 0 20px;} 
                
                /* 100percent width section with 20px padding top & bottom */
                *[class="100padtopbottom"] {width:100% !important; padding:20px 0px 20px 0px;} 
                
            
            }
                
            
        </style>
        
       
    </head>
    
    
    <div style="background:#687079;">
    
    <body style="padding:0; margin:0" bgcolor="#687079">
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">
        <tr>
            <td align="center" valign="top">
            
                <table width="640" border="0" cellspacing="0" cellpadding="0" class="hide">
                    <tr>
                        <td height="20"></td>
                    </tr>
                </table>
                
                <table width="640" cellspacing="0" cellpadding="0" bgcolor="#" class="100p">
                    <tr>
                        <td bgcolor="#3f51b5" width="640" valign="top" class="100p">
                            <!--[if gte mso 9]>
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                <v:fill type="tile" src="header-bg.jpg" color="#3b464e" />
                                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                    <![endif]-->
                                    <div>
                                        <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p">
                                            <tr>
                                                <td valign="top">
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td align="left" width="50%" class="100p">
                                                            <img src="cid:header_logo" alt="Logo" border="0" style="display:block" height="35"/>
                                                            </td>
                                                            <td width="50%" class="hide" align="right" style="font-size:16px; color:#FFFFFF;"><font face="'Roboto', Arial, sans-serif"><a href="#" style="color:#FFFFFF; text-decoration:none;"></a> &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; <a href="#" style="color:#FFFFFF; text-decoration:none;"></a></font></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="600" class="100p">
                                                        <tr>
                                                            <td height="35"></td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="color:#FFFFFF; font-size:24px;">
                                                                <font face="'Roboto', Arial, sans-serif">
                                                                    <span style="font-size:44px;">Introducing Tracker</span><br />
                                                                    <br />
                                                                    <Span style="font-size:24px;">Your ultimate money<br />
                                                                    tracking solution</Span>
                                                                    <br /><br />
                                                                    
                                                                    <a href="http://<?php echo $mailParam['siteURL']; ?>/registration.php" style="color:#FFFFFF; text-decoration:none;">
                                                                    <table border="0" cellspacing="0" cellpadding="10" style="border:2px solid #FFFFFF;">
                                                                        <tr>
                                                                            <td align="center" style="color:#FFFFFF; font-size:16px;"><font face="'Roboto', Arial, sans-serif"><a href="${GlobalConfig.APP_URL}/register" style="color:#FFFFFF; text-decoration:none;">TRY, IT'S FREE</a></font></td>
                                                                        </tr>
                                                                    </table>
                                                                    </a>
                                                                </font>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="35"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <!--[if gte mso 9]>
                                </v:textbox>
                            </v:rect>
                            <![endif]-->
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ff4081" class="100p">
                    <tr>
                        <td align="center" style="font-size:24px; color:#FFFFFF;"><font face="'Roboto', Arial, sans-serif">Why Tracker?</font></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" class="100p" bgcolor="#FFFFFF">
                    <tr>
                        <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" class="100padtopbottom" width="600">
                                <tr>
                                    <td align="left" class="condensed" valign="top">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" class="mob-column" width="290">
                                            <tr>
                                                <td valign="top" align="center">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td valign="top" align="center" class="100padleftright">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-inr" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                        <td width="20"></td>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-share-square" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td valign="top" class="100padleftright" align="center">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td valign="top" width="135" align="center" style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track your all Bank Accounts</font></td>
                                                                        <td width="20"></td>
                                                                        <td valign="top" width="135" align="center"  style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track your monthly Expense</font></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="20" class="hide"></td>
                                    <td align="left" class="condensed" valign="top">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" class="mob-column" width="290">
                                            <tr>
                                                <td valign="top" align="center">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td valign="top" align="center" class="100padleftright">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="135" align="center">
                                                                            <a href="#">
                                                                                <i class="fa fa-unlock-alt" style="font-size:35pt;color:#3F51B5"></i>
                                                                            </a>
                                                                        </td>
                                                                        <td width="20"></td>
                                                                        <td width="135" align="center"><a href="#">
                                                                            <i class="fa fa-handshake-o" style="font-size:35pt;color:#3F51B5"></i>
                                                                        </a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td valign="top" class="100padleftright" align="center">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td valign="top" width="135" align="center" style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track all your Passwords</font></td>
                                                                        <td width="20"></td>
                                                                        <td valign="top" width="135" align="center"  style="font-size:17px; color:#3f51b5; font-weight: bold"><font face="'Roboto', Arial, sans-serif">Track settlement with friends</font></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#3f51b5" class="100p" height="1">
                    <tr>
                        <td width="20" bgcolor="#FFFFFF"></td>
                        <td align="center" height="1" style="line-height:0px; font-size:1px;">&nbsp;</td>
                        <td width="20" bgcolor="#ffffff"></td>
                    </tr>
                </table>            
                <table width="640" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="center" style="padding-top: 10px"><img src="cid:footer_logo" class="100p" border="0" style="display:block" /></td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ff4081" class="100p">
                    <tr>
                        <td align="center" style="font-size:16px; color:#ffffff;"><font face="'Roboto', Arial, sans-serif"><span style="font-size:24px;">We will amaze you</span><br />
                            <br />
                            <span style="font-size:16px;">Tracker will help you to keep track of single penny you earn, the more you keep track more you save next time. Tracker will also help you to plan your future expenses as well as trip expense. Tracker also comes with awesome graphical statistics of your past expenses and settlements.</span></font>
                        </td>
                    </tr>
                </table>
                <table width="640" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" class="100p">
                    <tr>
                        <td align="left" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">&copy; Tracker 2016</font></td>
                        <td align="right" width="50%" style="font-size:14px; color:#848484;"><font face="'Roboto', Arial, sans-serif">Unsubscribe</font></td>
                    </tr>
                </table>
                <table width="640" class="100p" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="50"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
        
    </body>
    </html>`;

    return mailMessage;
}