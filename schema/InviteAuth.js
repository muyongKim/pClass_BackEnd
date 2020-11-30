const mongoose = require('mongoose');

const inviteAuthSchema = mongoose.Schema({
    user_email: String,
    auth_code: String
})

const InviteAuth = mongoose.model('InviteAuth', inviteAuthSchema);
module.exports = { InviteAuth };