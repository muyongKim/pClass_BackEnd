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
    },

    project: [
        {
            projectname: String,
            leader: String,
            sub_id: String,
           
            contributor: [
                {
                    type: String
                }
            ],
            
            projectreadme: {
                type: String,
                default: null
            },
            
            chatting: [ 
                {
                    username: String,
                    content: String,
                    time: String
                }
            ],
        
            notification: [
                {
                    content: String,
                    time: String
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
                            time: String
                        }
                    ]
                }
            ]
        }
    ]
        
})

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = { Subject };