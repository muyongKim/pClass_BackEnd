const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    subjectname: {
        type: String,
        trim: true
    },
    
    professor: String,

    sub_id: {
        type: String,
        trim: true,
        unique: 1
    }
})

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = { Subject };