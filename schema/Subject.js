const mongoose = require('mongoose');

// 전체 과목 리스트
// const subjectList = mongoose.Schema({
//     subjectlist: Array
// })

const subjectSchema = mongoose.Schema({
    subjectname: String,
    p_list: Array,
    sub_id: String,
    professor: String
})