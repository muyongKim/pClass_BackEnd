const express = require('express');
const feed_router = express.Router();
const { Feed } = require("../schema/Feed");

// 피드 추가 ToDo
feed_router.post('/api/:subId/:projectId/addToDo', (req, res) => {
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
});

// 피드 수정
feed_router.put('/api/:subId/:projectId/:feedId/modifyfeed', (req, res) => {
    Feed.findByIdAndUpdate({_id: req.params.feedId}, {
        feedname: req.body.feedname,
        manager: req.body.manager,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        content: req.body.content
    }, (err, data) => {
        if (err) return res.status(400).json({success: false, err});
        return res.status(200).json({success: true});
    });
});

// 피드 삭제
feed_router.delete('/api/:subId/:projectId/:feedId/deletefeed', (req, res) => {
    Feed.findByIdAndDelete({_id: req.params.feedId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(204).end();
    });
});

//프로젝트 내 TODO피드 조회
feed_router.get("/api/:subId/:projectId/ToDo", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column0'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});
  
//프로젝트 내 Doing피드 조회
feed_router.get("/api/:subId/:projectId/Doing", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column1'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});
  
  //프로젝트 내 Done피드 조회
  feed_router.get("/api/:subId/:projectId/Done", (req, res) => {
    Feed.find({$and: [{project_id: req.params.projectId},{status: 'column2'}]}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json(data);
      });
});

// 피드 DRAG & DROP 상태 변경
feed_router.put('/api/:subId/:projectId/feedDragDrop', (req, res) => {
    Feed.findByIdAndUpdate({_id: req.body.feedId}, {status: req.body.status}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({success: true});
    });
});

module.exports = feed_router;