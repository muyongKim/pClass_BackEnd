const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    projectname: String,
    contributor: Array,
    leader: String,
    sub_id: String,
   
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
    ]
})

const Project = mongoose.model('Project', projectSchema);
module.exports = { Project };