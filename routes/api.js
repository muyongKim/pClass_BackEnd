const express = require('express');
const { User } = require("../schema/User");
const { Project } = require("../schema/Project");
const { Subject } = require("../schema/Subject");

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
    const subject = new Subject();
    Subject.find({}, {_id: false, subjectname: true, sub_id: true}, function(err, subject) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(subject);
    })
})

// 과목의 개설된 프로젝트 표시
router.get('/api/subjectmenu/:subjectId', (req, res) => {
    Subject.findOne({sub_id: req.params.subjectId}, function(err, subject) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(subject);
    })
})
  
//프로젝트 개설
// router.post("/api/project/register", async (req, res) => {
//     const project = new Project({
//       projectname: req.body.projectname,
//       projectreadme: req.body.projectreadme
//     });
//     try {
//       const saveProject = await project.save();
//       res.json(saveProject);
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   });

// 프로젝트 개설
router.post("/api/project/register", (req, res) => {
    const project = new Subject({
        projectname: req.body.projectname,
        projectreadme: req.body.projectreadme,
        leader: req.body.name
    });
    
    project.save();
    Subject.findByIdAndUpdate({_id: req.body.userId}, {$push: {p_list: project}}).then(function() {
        Subject.findByIdAndUpdate({_id: req.body.subId}, {$push: {p_list: project}}, (err, user) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({success: true});
        })
    })
})
  
  //프로젝트 조회
  router.get("/api/project", function(req, res) {
    const project = new Project();
    Project.find(function(err, project) {
      if (err) return res.status(400).send(err)
      return res.json(project);
    });
  });
  
  //프로젝트 삭제
  router.delete("/api/project/:projectId", async (req, res) => {
    try {
      const removeProject = await Project.remove({ _id: req.params.projectId });
      res.json(removeProject);
    } catch (err) {
      res.status(400).send(err);
    }
  });

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

// 알림 생성, 알림 불러오기, 팀원 초대, 프로젝트 나가기, 진행률, 참여율

// 프로젝트 이름 변경
router.put('/api/project/:id/settings/modifyname', (req, res) => {
    const project = new Project();
    Project.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Project.findOne({_id: req.params.id}, (err, project) => {
            if (err) return res.json({success: false, err});
            return res.status(200).json({success: true, projectname: project.projectname});
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