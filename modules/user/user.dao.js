const User = require('./models/user.model');
const Role = require('../role/models/role.model');
const MasterDataDao = require('../masterdata/masterdata.dao');
module.exports = {
    getUserBy,
    getUsersByRole
}

async function getUserBy(fields, values) {
    let query = {};
    for (let index = 0; index < fields.length; index++) {
        query[fields[index]] = values[index];
    }

    let user = await User.findOne(query);
    return user;
}

async function getUsersByRole(roleCd) {
    try {
        let role = await Role.findOne({
            roleCode: roleCd
        });

        let activeUserStatus = await MasterDataDao.getDataByParentAndConfig('USER_STATUS', 'ACTIVE');

        let users = await User.find({
            role: role._id,
            status: activeUserStatus._id
        });

        return users;
    } catch (error) {
        throw error;
    }
}