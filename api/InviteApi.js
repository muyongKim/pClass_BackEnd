const express = require('express');
const invite_router = express.Router();
const nodemailer = require('nodemailer');
const { User } = require("../schema/User");
const { Project } = require("../schema/Project");
const { InviteAuth } = require("../schema/InviteAuth");

// 팀원 초대
invite_router.put('/api/:subId/:projectId/settings/invite', (req, res) => {
    const email = req.body.email; 
    const user = User.find({email: email});
    if (user) {
        const auth_code = Math.random().toString().substr(2,5);
        const user_email = email;
        Project.findByIdAndUpdate({_id: req.params.projectId}, 
            {$push: {contributor: req.body.email}}, (err, data, next) => {
                if (err) return res.status(400).json(err);
        });
        const data = {
            user_email,
            auth_code
        }
        InviteAuth.create(data);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gamil.com',
            port: 465,
            secure: true,
            auth: {
                user: 'wykimtest@gmail.com',
                pass: '76029766!@'
            }
        });

        let mailOptions = {
            from: 'wykimtest@gmail.com',
            to: email,
            subject: '안녕하세요! pClass에서 진행 중인 프로젝트의 초대 메일입니다.',
            html: 
            `<p>안녕하세요! 현재 pClass에서 진행 중인 프로젝트에 초대되셨습니다.</p>`+
            `<p>프로젝트에 참여하시려면 아래 링크에서 인증번호를 입력해주세요.</p>` +
            `<a href="https://ec2-15-165-236-0.ap-northeast-2.compute.amazonaws.com:4000/api/auth/invite">참여하기</a>` +
            `<p><b>인증코드: ${auth_code}</b></p>`
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) return res.status(400).json(err);
            return res.json({message: 'Email Sent'});
            transporter.close();
        });
        return res.status(200).json({success: true, auth_code});
    } else return res.status(400).json(err);
});

// 팀원 초대 수락
invite_router.get('/api/auth/invite', (req, res) => {
    InviteAuth.findOne({auth_code: req.body.auth_code}, (err, data) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json({success: true, data});
    });
});

module.exports = invite_router;