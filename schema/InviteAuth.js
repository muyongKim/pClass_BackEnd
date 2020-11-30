const mongoose = require('mongoose');

const inviteAuthSchema = mongoose.Schema({
    invite_token: String,
    user_email: String,
    auth_num: String
})

const InviteAuth = mongoose.model('InviteAuth', inviteAuthSchema);
module.exports = { InviteAuth };