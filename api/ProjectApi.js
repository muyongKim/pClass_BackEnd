const express = require('express');
const project_router = express.Router();
const { User } = require("../schema/User");
const { Project } = require("../schema/Project");

// 프로젝트 개설
project_router.post('/api/:subId/project/register', (req, res) => {
    const project = new Project({ 
        projectname: req.body.projectname,
        projectreadme: req.body.projectreadme,
        leader: req.body.name,
        contributor: req.body.email,
        sub_id: req.params.subId
    });
    project.save();
    User.findByIdAndUpdate({_id: req.body.userId}, 
        {$push: {p_list: project}}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({success: true});
    });
});

// 프로젝트 삭제
project_router.put('/api/:projectId/delete', (req, res) => {
    Project.findByIdAndDelete({_id: req.params.projectId}).then(function() {
        User.findOneAndUpdate({_id: req.body.userId}, 
            { $pull: { p_list: {projectname: req.body.projectname}}}, {safe:true, upsert: true}, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(204).end();
        });
    });
});

// 프로젝트 정보 조회
project_router.post('/api/project/main', (req, res) => {
    Project.findById({_id: req.body.projectId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
    });
});

// 프로젝트 이름 & README 수정
project_router.put('/api/:subId/:projectId/settings/modifyname', (req, res) => {
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
project_router.put('/api/:subId/:projectId/settings/leaveproject', (req, res) => {
    Project.findByIdAndUpdate({_id: req.params.projectId}, {$pull: {contributor: req.body.useremail}}).then(function() {
        User.updateOne({_id: req.body.userId}, 
            {$pull: {p_list: {projectname: req.body.projectname}}},(err, data) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true});
        });
    });
});


// 프로젝트 컨트리뷰터 확인
project_router.post('/api/:subId/:projectId/isContributed', (req, res) => {
    Project.findOne({$and: [{_id: req.params.projectId}, {contributor: req.body.email}]}, (err, data) => {
        if (!data) return res.status(200).json(false)
        return res.status(200).json(true);
    });
});

module.exports = project_router;