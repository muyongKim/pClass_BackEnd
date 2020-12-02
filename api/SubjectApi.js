const express = require('express');
const subject_router = express.Router();
const { Subject} = require("../schema/Subject");
const { Project } = require("../schema/Project");

// 전체 과목 Get
subject_router.get('/api/subjectmenu', function(req, res) {
    Subject.find({}, {_id: false, subjectname: true, sub_id: true}, function(err, subject) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(subject);
    });
});

// 과목의 개설된 프로젝트 표시
subject_router.get('/api/subjectmenu/:subjectId', (req, res) => {
    Project.find({sub_id: req.params.subjectId}, function(err, data) {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
    });
});

module.exports = subject_router;