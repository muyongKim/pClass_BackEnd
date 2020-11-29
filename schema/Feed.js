const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
    sub_id: String,
    project_id: String,
    feedname: String,
    manager: Array,
    start_date: Number,
    end_date: Number,
    status: String,
    content: String
})

const Feed = mongoose.model('Feed', feedSchema);
module.exports = { Feed };