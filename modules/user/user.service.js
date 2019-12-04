const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

module.exports = {
    save_user,
    check_availability,
    get_user_by,
    attach_role,
    authenticate
}

async function save_user(params) {
    let user = await User.findOne({
        username: params.username
    });
    if (!user) {
        params.password = bcrypt.hashSync(params.password, 10);
        let user = await new User(params).save();
    }
    return user;
}

async function check_availability(params) {
    let search_query = {};
    search_query[params.search_field] = params.search_value;

    let user = await User.find(search_query);
    if(user) {
        return false;
    }
    return true;
}

async function get_user_by(params) {
    let search_query = {};
    search_query[params.search_key] = params.search_value;
    let user = await User.find(search_query);
    return user;
}

async function attach_role(params) {
    let user = await User.findById(params.user_id);
    if(user && params.role_id) {
        user.role = params.role_id;
        user = await User.update({
            _id: user._id
        }, user);
    }
    return user;
}

async function authenticate(params) {
    let search_query = {
        search_key: 'username',
        search_value: params.username 
    };
    let user = await get_user_by(search_query);
    if(user.length === 0) {
        return {
            status: false,
            message: 'User does not exist, please register'
        };
    } else {
        if (bcrypt.compareSync(params.password, user[0].password)) {
            return {
                status: true,
                message: 'User authenticated successfully',
                user
            };  
        } else {
            return {
                status: false,
                message: 'Invalid Username or Password, please try again'
            };    
        }
    }
}