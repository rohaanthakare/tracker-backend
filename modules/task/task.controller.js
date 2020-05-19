module.exports = {
    getUserTasks, createUserTask, updateUserTask, deleteUserTask, getTaskDetails
};

async function getUserTasks(req, res) {
    try {
        res.send({
            status: true,
            message: 'Get User Tasks'
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function createUserTask(req, res) {
    try {
        res.send({
            status: true,
            message: 'Create User Tasks'
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function updateUserTask(req, res) {
    try {
        res.send({
            status: true,
            message: 'Get User Tasks'
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function deleteUserTask(req, res) {
    try {
        res.send({
            status: true,
            message: 'Get User Tasks'
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}

async function getTaskDetails(req, res) {
    try {
        res.send({
            status: true,
            message: 'Get User Tasks'
        });
    } catch(error) {
        let errorMsg = (typeof error === 'string') ? error : GlobalEnum.ERRORS[500];
        res.status(500).send({
            message: errorMsg
        });
    }
}