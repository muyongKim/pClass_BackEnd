const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    username: String,
    content: String,
    time: String
})

const feedSchema = mongoose.Schema({
    feedname: String,
    manager: Array,
    start_date: Number,
    end_date: Number,
    status: String,
    content: String,
    comment: commentSchema
})

const projectSchema = mongoose.Schema({
    projectname: String,
    contributor: Array,
    leader: String,
   
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

    feed: feedSchema
})

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
    },

    project: projectSchema
})

const Subject = mongoose.model('Subject', subjectSchema);
const Project = mongoose.model('Project', projectSchema);
const Feed = mongoose.model('Feed', feedSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Subject, Project, Feed, Comment };