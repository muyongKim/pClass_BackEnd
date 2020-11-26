const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    projectname: String,
    contributor: Array,
    leader: String,
    sub_id: String,

    chatting: [ 
        {
            username: String,
            content: String,
            time: Number
        }
    ],

    notification: [
        {
            content: String,
            time: Number
        }
    ],

    feed: [
         {
            feedname: String,
            manager: Array,
            start_date: Number,
            end_date: Number,
            status: String,
            content: String,

            comment: [
                {
                    username: String,
                    content: String,
                    time: Number
                }
            ]
        }
    ]
})