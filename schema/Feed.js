const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
    sub_id: String,
    project_id: String,
    writer: String,
    feedname: String,
    manager: String, 
    start_date: String,
    end_date: String,
    status: String,     // ToDo : 0, Doing : 1, Done : 2
    content: {type: String, default: null}
})

const Feed = mongoose.model('Feed', feedSchema);
module.exports = { Feed };