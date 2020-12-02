const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// DEFINE MODEL
const { User } = require("./schema/User");
const { Project } = require("./schema/Project");
const { Subject } = require("./schema/Subject");

// CONFIGURE SERVER PORT
const port = process.env.PORT || 4000;

// CONNECT DATABASE
mongoose.connect('mongodb+srv://dbUser:9282@mycluster.1og6o.mongodb.net/pClassDB?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// SOLVE CORS POLICY
let corsOption = {
    origin: 'http://localhost:3000',
    credentials: true
}

server.use(cors(corsOption));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));

// IMPORT ROUTES
const user_router = require('./api/UserApi');
const subject_router = require('./api/SubjectApi');
const project_router = require('./api/ProjectApi');
const feed_router = require('./api/FeedApi');
const comment_router = require('./api/CommentApi');
const invite_router = require('./api/InviteApi');
server.use('/', user_router);
server.use('/', subject_router);
server.use('/', project_router);
server.use('/', feed_router);
server.use('/', comment_router);
server.use('/', invite_router);

// RUN SERVER
server.listen(port, () => console.log(`Listening on port ${port}`));