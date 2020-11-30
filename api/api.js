const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User } = require("../schema/User");
const { Subject} = require("../schema/Subject");
const { Project } = require("../schema/Project");
const { Feed } = require("../schema/Feed");
const { Comment } = require("../schema/Comment");
const { InviteAuth } = require("../schema/InviteAuth");
const { nextTick } = require('process');

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
    User.findByIdAndUpdate({_id: req.body.userId}, 
        {$push: {p_list: project}}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({success: true});
    })
})

// 프로젝트 삭제
router.put('/api/:projectId/delete', (req, res) => {
    Project.findByIdAndDelete({_id: req.params.projectId}).then(function() {
        User.findOneAndUpdate({_id: req.body.userId}, 
            { $pull: { p_list: {projectname: req.body.projectname}}}, {safe:true, upsert: true}, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(204).end();
        })
    })
})

// 프로젝트 정보 조회
router.post('/api/project/main', (req, res) => {
    Project.findById({_id: req.body.projectId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
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

// 피드 추가 ToDo
router.post('/api/:subId/:projectId/addToDo', (req, res) => {
    const feed = new Feed({
        sub_id: req.params.subId,
        project_id: req.params.projectId,
        writer: req.body.writer,
        feedname: req.body.feedname,
        manager: req.body.manager,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        content: req.body.content,
        status: req.body.status
    });
    feed.save((err, data) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    });
})

// 피드 수정
router.put('/api/:subId/:projectId/:feedId/modifyfeed', (req, res) => {
    Feed.findByIdAndUpdate({_id: req.params.feedId}, {
        feedname: req.body.feedname,
        writer: req.body.writer,
        manager: req.body.manager,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        status: req.body.status,
        content: req.body.content
    }, (err, data) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    })
})

// 피드 삭제
router.delete('/api/:subId/:projectId/:feedId/deletefeed', (req, res) => {
    Feed.findByIdAndDelete({_id: req.params.feedId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(204).end();
    })
})

//프로젝트 내 TODO피드 조회
router.get("/api/:subId/:projectId/ToDo", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column0'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});
  
//프로젝트 내 Doing피드 조회
router.get("/api/:subId/:projectId/Doing", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column1'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});
  
  //프로젝트 내 Done피드 조회
  router.get("/api/:subId/:projectId/Done", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column2'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});

// 피드 DRAG & DROP 상태 변경
router.put('/api/:subId/:projectId/feedDragDrop', (req, res) => {
    Feed.findByIdAndUpdate({_id: req.body.feedId}, {status: req.body.status}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({success: true});
    })
})

// 프로젝트 이름 & README 수정
router.put('/api/:subId/:projectId/settings/modifyname', (req, res) => {
    Project.findByIdAndUpdate({_id: req.params.projectId}, 
        {projectname: req.body.modifyname, projectreadme: req.body.modifyreadme}).then(function(){
        User.updateOne({'p_list.projectname': req.body.beforename}, 
        {$set: {'p_list.$.projectname': req.body.modifyname}}, (err, data) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true});
        });
    });
});

// 프로젝트 나가기
router.put('/api/:subId/:projectId/settings/leaveproject', (req, res) => {
    Project.findByIdAndUpdate({_id: req.params.projectId}, {$pull: {contributor: req.body.useremail}}).then(function() {
        User.updateOne({_id: req.body.userId}, 
            {$pull: {p_list: {projectname: req.body.projectname}}},(err, data) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true});
        });
    });
});

//코멘트 생성
router.post('/api/subject/:subId/:projectId/:feedId/addcomment', (req, res) => {
    const comment = new Comment({
        sub_id: req.params.subId,
        project_id: req.params.projectId,
        feed_id: req.params.feedId,
        username: req.body.username,
        content: req.body.content,
        time: req.body.time
    });

    comment.save((err, data) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    });

})

//코멘트 삭제
router.delete('/api/:commentId/deletecomment', (req, res) => {
    Comment.findByIdAndDelete({_id: req.params.commentId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).end();
    });
});

// 코멘트 조회
router.get('/api/subject/:subId/:projectId/:feedId/getcomment', (req, res) => {
    Comment.find({ feed_id: req.params.feedId }, (err, data) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(data);
    });
  });

// //채팅 생성
// router.post('/api/subject/:subId/:projectId/registerchatting'), (req, res) => {
//      Project.findByIdAndUpdate({_id: req.params.projectId}, {$set:{username: req.username, content: req.content, time: req.time}}, (err, data)=>{
//         if (err) return res.json({success: false, err});
//         return res.status(200).json({success: true});
//      })
    
// }

// //채팅 불러오기 하다맘
// router.get('/api/subject/:subId/:projectId/showchatting'), (req, res) => {
//     Project.findById({_id: req.body.projectId}, (err, data) => {
//         if (err) return res.status(400).send(err);
//         return res.status(200).json(data);
//     })
// }

// 팀원 초대
router.put('/api/:subId/:projectId/settings/invite', (req, res) => {
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
router.get('/api/auth/invite', (req, res) => {
    InviteAuth.findOne({auth_code: req.body.auth_code}, (err, data) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json({success: true, data});
    });
});

module.exports = router;