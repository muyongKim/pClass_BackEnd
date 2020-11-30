const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const { User } = require("../schema/User");
const { Subject} = require("../schema/Subject");
const { Project } = require("../schema/Project");
const { Feed } = require("../schema/Feed");
const { Comment } = require("../schema/Comment");
var fileDir = path.dirname(require.main.filename);

router.post('/api/:subId/:projectId/settings/invite', (req, res) => {
    let auth_num = Math.random().toString().substr(2,6);
    const email = req.body.email; 
    const token =1234;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gamil.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    let mailOptions = {
        from: '김우용',
        to: email,
        subject: '안녕하세요! pClass에서 진행 중인 프로젝트의 초대 메일입니다.',
        html: 
        '<p>안녕하세요! 현재 pClass에서 진행 중인 프로젝트에 초대되셨습니다.</p>'+
        '<p>프로젝트에 참여하시려면 아래 링크에서 인증번호를 입력해주세요.</p>' +
        '<a href="http://localhost:4000/api/:subId/:projectId:/auth/invite=${token}">참여하기</a>'
    }
})