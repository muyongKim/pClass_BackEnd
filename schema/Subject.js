const mongoose = require('mongoose');

// 전체 과목 리스트
// const subjectList = mongoose.Schema({
//     subjectlist: Array
// })

const subjectSchema = mongoose.Schema({
    subjectname: {
        type: String,
        trim: true
    },
    
    p_list: Array,
    professor: String,

    sub_id: {
        type: String,
        trim: true,
        unique: 1
    }
})

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = { Subject };