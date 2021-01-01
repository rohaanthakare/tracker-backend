const User = require('../user/models/user.model');
const UserService = require('../user/user.service');
const TrackerMailer = require('./trackermailer.service');
const GlobalEnum = require('./global.enumeration');
const moment = require('moment');
const HelperService = require('./helper.service');
const CurrencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
});

module.exports = {
    testMailTemplate
}

async function testMailTemplate(req, res) {
    try {
        let user = await User.findOne({
            username: 'demo'
        });
        user.emailId = 'rohaanthakare@gmail.com';
        switch(req.body.name) {
            case 'ACTIVATION_MAIL': 
                await TrackerMailer.sendActivationMail(user);
            break;
    
            case 'INVITATION_MAIL':
                await TrackerMailer.sendTrackerInviteMail(user);
            break;
    
            case 'RESET_PASSWORD_MAIL':
                await TrackerMailer.sendResetPassLinkMail(user);
            break;
    
            case 'DAILY_STATUS_MAIL':
                let dailyStatus = await UserService.getDailyStatus(user._id);
                let mailParam = {};
                mailParam.mailDate = moment().format('MMM DD, YYYY');
                mailParam.name = HelperService.getDisplayName(user);
                if (dailyStatus.balance.length > 0) {
                    mailParam.balance = CurrencyFormatter.format(dailyStatus.balance[0].total).substr(1);
                } else {
                    mailParam.balance = '0.00';
                }
            
                if (dailyStatus.expense.length > 0) {
                    mailParam.expense = CurrencyFormatter.format(dailyStatus.expense[0].total).substr(1);
                } else {
                    mailParam.expense = '0.00';
                }
                mailParam.moneyToTake = CurrencyFormatter.format(dailyStatus.settlements.MONEY_TO_TAKE).substr(1);
                mailParam.moneyToGive = CurrencyFormatter.format(dailyStatus.settlements.MONEY_TO_GIVE).substr(1);
                mailParam.transactions = [];
                for (let index = 0; index < dailyStatus.transactions.length; index++) {
                    const currentTrans = dailyStatus.transactions[index];
                    const newTrans = {};
                    newTrans.transactionCategory = currentTrans.transactionCategory.configName;
                    newTrans.transactionSubCategory = currentTrans.transactionSubCategory.configName;
                    newTrans.transactionDetail = currentTrans.transactionDetail;
                    newTrans.transactionAmount = CurrencyFormatter.format(currentTrans.transactionAmount).substr(1);
                    mailParam.transactions.push(newTrans);
                }
                mailParam.emailId = 'rohaanthakare@gmail.com';
                console.log('----------Daily Status Mail Param--------');
                console.log(mailParam);
                await TrackerMailer.sendDailyStatusMail(mailParam);
            break;
        }
        res.send({
            status: true,
            message: 'Template mail sent'
        });
    } catch (error) {
        console.log('---------testMailtemplate---------');
        console.log(error);
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}