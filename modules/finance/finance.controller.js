const GlobalEnum = require('../global/global.enumeration');
const FinanceService = require('./finance.service');
const FinanceWorkflow = require('./finance.workflow');
const MasterDataDao = require('../masterdata/masterdata.dao');
const HelperService = require('../global/helper.service');

module.exports = {
    createBank, getBanks,
    createBranch, getBranches,
    getFinancialAccounts, createFinancialAccount, updateFinancialAccount, getFinancialAccountDetail, transferMoney,
    depositMoney, getUserTransactions, revertTransaction, addExpense, getContactTransactions,
    createFinancialProfile, getFinancialProfile, updateFinancialProfile, addInvestment, getFinancialAccountsForUser,
    startNewInvestment, getUserInvestments, investMoney, getInvestmentTransactions, closeInvestment
}

async function createBank(req, res) {
    try {
        let bank = await FinanceService.createBank(req.body);
        res.send({
            message: 'Bank created successfully',
            bank
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getBanks(req, res) {
    try {
        let banks = await FinanceService.getBanks(req.body);
        res.send({
            status: true,
            banks
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createBranch(req, res) {
    try {
        let bank = await FinanceService.createBranch(req.body);
        res.send({
            message: 'Branch created successfully',
            bank
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getBranches(req, res) {
    try {
        let branches = await FinanceService.getBranches(req.body);
        res.send({
            status: true,
            branches
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialAccounts(req, res) {
    try {
        let accounts = await FinanceService.getFinancialAccounts(req.current_user._id);
        res.send(accounts);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialAccountsForUser(req, res) {
    try {
        let accounts = await FinanceService.getFinancialAccounts(req.params.user_id);
        res.send(accounts);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createFinancialAccount(req, res) {
    try {
        let account = await FinanceService.createFinancialAccount(req.body.accountDetails, req.current_user);
        res.send({
            status: true,
            message:'Financial Account created successfully',
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function updateFinancialAccount(req, res) {
    try {
        let account = await FinanceService.updateFinancialAccount(req.params.id, req.body.accountDetails, req.current_user);
        res.send({
            status: true,
            message:'Financial Account updated successfully',
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialAccountDetail(req, res) {
    try {
        let account = await FinanceService.getFinancialAccountDetail(req.params.id, req.current_user);
        res.send({
            status: true,
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function depositMoney(req, res) {
    try {
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'DEPOSIT');
        let params = req.body.transactionDetail;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.transactionSubCategory._id;
        params.user = req.current_user._id;
        params.account = (params.account) ? params.account._id : null;
        params.transactionType = creditTrnsaction._id; 
        delete params.depositType;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        res.send({
            status: true,
            message: 'Money deposited successfully, please check account balance',
            transaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function transferMoney(req, res) {
    try {
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'TRANSFER');
        let params = req.body;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.transactionSubCategory._id;
        params.user = req.current_user._id;
        params.fromAccount = (params.fromAccount) ? params.fromAccount._id : null;
        params.fromAccountTransType = debitTrnsaction._id;
        params.toAccount = (params.toAccount) ? params.toAccount._id : null;
        params.toAccountTransType = creditTrnsaction._id;
        params.transactionType = debitTrnsaction._id; 
        delete params.transferType;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        res.send({
            status: true,
            message: 'Money transfered successfully, please check account balance',
            transaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getUserTransactions(req, res) {
    try {
        let transactions = await FinanceService.getUserTransctions(req.query, req.current_user);
        res.send(transactions);
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function revertTransaction(req, res) {
    try {
        let revertTransaction = await FinanceWorkflow.revertTransaction(req.params.id, req.current_user);
        res.send({
            status: true,
            revertTransaction});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function addExpense(req, res) {
    try {
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'EXPENSE');
        let params = req.body;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.transactionSubCategory._id;
        params.userContacts = (params.userContacts) ? JSON.parse(params.userContacts) : undefined;
        params.user = req.current_user._id;
        params.account = (params.account) ? params.account._id : null;
        params.transactionType = debitTrnsaction._id; 
        delete params.expenseType;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        res.send({
            status: true,
            message: 'Expense added successfully, please check account balance',
            transaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function addInvestment(req, res) {
    try {
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'INVESTMENT');
        let params = req.body;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.transactionSubCategory._id;
        params.user = req.current_user._id;
        params.account = (params.account) ? params.account._id : null;
        params.transactionType = debitTrnsaction._id; 
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        res.send({
            status: true,
            message: 'Investment added successfully, please check account balance',
            transaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getContactTransactions(req, res) {
    try {
        let transactions = await FinanceService.getContactTransactions(req.params.contact_id, req.current_user);
        res.send({
            status: true,
            data: transactions
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createFinancialProfile(req, res) {
    try {
        let params = req.body;
        params.user = req.current_user._id;
        let profile = await FinanceService.createFinanceProfile(params);
        res.send({
            status: true,
            message:'Financial Profile created successfully',
            profile});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getFinancialProfile(req, res) {
    try {
        let profile = await FinanceService.getFinancialProfile(req.current_user._id);
        res.send({
            status: true,
            profile
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function updateFinancialProfile(req, res) {
    try {
        let profile_id = req.params.id;
        let account = await FinanceService.updateFinancialProfile(profile_id, req.body);
        res.send({
            status: true,
            message:'Financial Profile updated successfully',
            account});
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function startNewInvestment(req, res) {
    try {
        let params = req.body;
        params.investmentType = params.investmentType._id;
        params.user = req.current_user._id;
        params.investmentAmount = 0;
        params.isActive = true;
        let investment = await FinanceService.startNewInvestment(params);
        res.send({
            status: true,
            message: 'Investment started successfully',
            investment
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getUserInvestments(req, res) {
    try {
        let investments = await FinanceService.getUserInvestments(req.current_user._id);
        res.send({
            status: true,
            message: 'Investments list fetched successfully',
            investments
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function investMoney(req, res) {
    try {
        let investmentTransaction = null;
        let debitTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'DEBIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'INVESTMENT');
        let params = req.body;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.investmentDetail.investmentType._id;
        params.user = req.current_user._id;
        params.account = (params.account) ? params.account._id : null;
        params.transactionType = debitTrnsaction._id;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        if (transaction) {
            investmentTransaction = await FinanceService.investMoney(params, req.current_user); 
        }
        res.send({
            status: true,
            message: 'Money invested successfully, please check account balance',
            investmentTransaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getInvestmentTransactions(req, res) {
    try {
        let investmentTrans = await FinanceService.getInvestmentTransactions(req.params.id);
        res.send({
            status: true,
            investmentTrans
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function closeInvestment(req, res) {
    try {
        let investmentTransaction = null;
        let creditTrnsaction = await MasterDataDao.getDataByParentAndConfig('TRANS_TYPE', 'CREDIT');
        let transactionCategory = await MasterDataDao.getDataByParentAndConfig('TRANS_CATEGORY', 'INVESTMENT');
        let params = req.body;
        params.transactionCategory = HelperService.getMongoObjectId(transactionCategory._id);
        params.transactionSubCategory = params.investmentDetail.investmentType._id;
        params.user = req.current_user._id;
        params.account = (params.account) ? params.account._id : null;
        params.transactionType = creditTrnsaction._id;
        let transaction = await FinanceWorkflow.createNewTransaction(params, req.current_user);
        if (transaction) {
            investmentTransaction = await FinanceService.closeInvestment(params, req.current_user); 
        }
        res.send({
            status: true,
            message: 'Money invested successfully, please check account balance',
            investmentTransaction
        });
    } catch (error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}