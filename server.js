const express = require('express');
const server = express();
const port = 4000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { User } = require("./schema/User");
const { Project } = require("./schema/Project");
const { Subject } = require("./schema/Subject");

// 데이터베이스 연결
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbUser:9282@mycluster.1og6o.mongodb.net/pClassDB?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// CORS policy 해결
let corsOption = {
    origin: 'http://localhost:3000',
    credentials: true
}
server.use(cors(corsOption));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));

// 터미널에 포트 번호 출력
server.listen(port, () => console.log(`Listening on port ${port}`));


// -------------------------api---------------------------------


// 회원가입
server.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({ success: true })
    })
})

// 로그인
server.post('/api/users/login', (req, res) => {
    
    // 요청된 이메일 탐색
    User.findOne({ email: req.body.email }, (err,user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "존재하지 않는 이메일입니다."
            })
        }
       
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다"});

             user.generateToken((err, user) => {
                 if (err) return res.status(400).send(err);
                    
                 return res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id, email: user.email, name: user.name })
             })   
        })
    })
})

// 모든 유저 데이터 조회
server.get('/api/users/all', function(req,res) {
    const user = new User();
    User.find(function(err, user) {
        if (err) return res.status(400).send(err);
        res.json(user);
    })
})

server.post('/api/subject/test', (req, res) => {
    const subject = new Subject(req.body);
    subject.save((err, subject) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({ success: true })
    })
})