const UserDao = require('./modules/user/user.dao');
const UserService = require('./modules/user/user.service');
const HelperService = require('./modules/global/helper.service');
const moment = require('moment');
const TrackerMailer = require('./modules/global/trackermailer.service');
const CurrencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
});
agenda.define('Send Finance Details at EOD', (job, done) => {
    console.log("Send Finance Details at EOD" + new Date());
    sendFinanceDetails();
    done();
});

agenda.on('ready', function () {
    console.log('Agenda is ready to roll');
    const options = {
        timezone: 'asia/calcutta'
    }
    agenda.every('00 16 * * *', 'Send Finance Details at EOD', options);
    agenda.start();
});

async function sendFinanceDetails() {
    let users = await UserDao.getUsersByRole('TRACKER_USER');
    for(let index = 0; index < users.length; index++) {
        const current_user = users[index];
        const user_status = await UserService.getDailyStatus(users[index]._id);        
        const finalStatus = await formatStatusData(current_user, user_status);
        await TrackerMailer.sendDailyStatusMail(finalStatus);
    }
}

async function formatStatusData(user, status) {
    const returnData = {};
    returnData.emailId = user.emailId;
    if (user.firstName) {
        returnData.name = HelperService.convertToTitleCase(user.firstName);
        if (user.lastName) {
            returnData.name = returnData.name + ' ' + HelperService.convertToTitleCase(user.lastName);
        }
    } else {
        returnData.name = HelperService.convertToTitleCase(user.username);
    }
    returnData.mailDate = moment().format('MMM DD, YYYY');
    if (status.balance.length > 0) {
        returnData.balance = CurrencyFormatter.format(status.balance[0].total).substr(1);
    } else {
        returnData.balance = '0.00';
    }

    if (status.expense.length > 0) {
        returnData.expense = CurrencyFormatter.format(status.expense[0].total).substr(1);
    } else {
        returnData.expense = '0.00';
    }
    returnData.moneyToTake = CurrencyFormatter.format(status.settlements.MONEY_TO_TAKE).substr(1);
    returnData.moneyToGive = CurrencyFormatter.format(status.settlements.MONEY_TO_GIVE).substr(1);
    returnData.transactions = [];
    for (let index = 0; index < status.transactions.length; index++) {
        const currentTrans = status.transactions[index];
        const newTrans = {};
        newTrans.transactionCategory = currentTrans.transactionCategory.configName;
        newTrans.transactionSubCategory = currentTrans.transactionSubCategory.configName;
        newTrans.transactionDetail = currentTrans.transactionDetail;
        newTrans.transactionAmount = CurrencyFormatter.format(currentTrans.transactionAmount).substr(1);
        returnData.transactions.push(newTrans);
    }

    return returnData;
}