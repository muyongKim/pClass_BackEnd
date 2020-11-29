const express = require('express');
const { User } = require("../schema/User");
const { Subject} = require("../schema/Subject");
const { Project } = require("../schema/Project");
const { Feed } = require("../schema/Feed");
const { Comment } = require("../schema/Comment");

const router = express.Router();

// 회원가입
router.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })
})

// 로그인
router.post('/api/users/login', (req, res) => {
    
    // 요청된 이메일 탐색
    User.findOne({email: req.body.email}, (err,user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "존재하지 않는 이메일입니다."
            })
        }
       
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다"});

             user.generateToken((err, user) => {
                 if (err) return res.status(400).send(err);
                    
                 return res.cookie("x_auth", user.token)
                        .status(200)
                        .json({loginSuccess: true, userId: user._id, email: user.email, name: user.name})
             })   
        })
    })
})

// 모든 유저 데이터 조회
router.get('/api/users/all', function(req, res) {
    User.find(function(err, user) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(user);
    })
})

// 전체 과목 Get
router.get('/api/subjectmenu', function(req, res) {
    Subject.find({}, {_id: false, subjectname: true, sub_id: true}, function(err, subject) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(subject);
    })
})

// 과목의 개설된 프로젝트 표시
router.get('/api/subjectmenu/:subjectId', (req, res) => {
    Project.find({sub_id: req.params.subjectId}, function(err, data) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
    })
})

// 프로젝트 개설
router.post('/api/:subId/project/register', (req, res) => {
    const project = new Project({ 
        projectname: req.body.projectname,
        projectreadme: req.body.projectreadme,
        leader: req.body.name,
        sub_id: req.params.subId
    });
    project.save();
    User.findByIdAndUpdate({_id: req.body.userId}, {$push: {p_list: project}}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({success: true});
    })
})

// 프로젝트 삭제
router.put('/api/:projectId/delete', (req, res) => {
    Project.findByIdAndDelete({_id: req.params.projectId}).then(function() {
        User.findOneAndUpdate({_id: req.body.userId}, { $pull: { p_list: {projectname: req.body.projectname}}}, {safe:true, upsert: true}, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(204).end();
        })
    })
})

// //subject DB에 데이터 삽입
// router.post('/api/subject/test', (req, res) => {
//     const subject = new Subject(req.body);
//     subject.save((err, subject) => {
//         if (err) return res.json({success: false, err});
//         return res.status(200).json({success: true});
//     })
// })

// // project DB에 데이터 삽입
// router.post('/api/project/test', (req, res) => {
//     const project = new Project(req.body);
//     project.save((err, project) => {
//         if (err) return res.json({success: false, err});
//         return res.status(200).json({success: true});
//     })
// })

// 피드 추가
router.post('/api/subject/:subId/:projectId', (req, res) => {
    const feed = new Feed({
        sub_id: req.params.subId,
        project_id: req.params.projectId,
        writer: req.body.username,
        feedname: req.body.feedname,
        manager: req.body.manager,
        start_date: req.body.start,
        end_date: req.body.end,
        content: req.body.content
    });
    feed.save((err, data) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    });
})

// 피드 수정
router.put('/api/subject/:subId/:projectId/:feedId/modifyfeed', (req, res) => {
    Feed.findByIdAndUpdate({_id: req.params.feedId}, req.body, (err, data) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    })
})

// 피드 삭제
router.delete('/api/subject/:subId/:projectId/:feedId/deletefeed', (req, res) => {
    Feed.findByIdAndDelete({_id: req.params.feedId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(204).end();
    })
})

// 알림 생성, 알림 불러오기, 팀원 초대, 프로젝트 나가기, 진행률, 참여율

// 프로젝트 이름 변경
router.put('/api/:subId/:projectId/settings/modifyname', (req, res) => {
    Project.findByIdAndUpdate({_id: req.params.projectId}, req.body).then(function(){
        Project.findOne({_id: req.params.projectId}, (err, project) => {
            if (err) return res.json({success: false, err});
            return res.status(200).json({success: true});
        })
    })
})

// 프로젝트 나가기
router.put('/api/project/:id/settings/leaveproject', (req, res) => {
    const project = new Project();
    Project.findByIdAndUpdate({_id: req.params.id}, {$pull: {contributor: req.body}}, (err, project) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    })
})

// 알림 생성


module.exports = router;