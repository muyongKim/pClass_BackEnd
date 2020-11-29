const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    professor: String,

    subjectname: {
        type: String,
        trim: true
    },

    sub_id: {
        type: String,
        trim: true,
        unique: 1
    }
})

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = { Subject };