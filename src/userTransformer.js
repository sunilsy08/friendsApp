const config = require('./config');

function transformUser(user){
    return user ? {
        id: user.id,
        name: user.lastname? `${user.first_name} ${user.last_name}` : `${user.first_name}`,
        avatar_url: user.avatar,
        status: Number(user.status) === config.ACTIVE_USER ? 'Active':'Inactive'
    }:[];
}

function transformFriendofFriend(user){
    return user ? {
        id: user.user_id,
        name: user.lastname? `${user.first_name} ${user.last_name}` : `${user.first_name}`,
        avatar_url: user.avatar,
        status: Number(user.status) === config.ACTIVE_USER ? 'Active':'Inactive'
    }:[];
}
module.exports = {transformUser,transformFriendofFriend}