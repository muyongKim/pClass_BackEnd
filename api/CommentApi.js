const express = require('express');
const comment_router = express.Router();
const { Comment } = require("../schema/Comment");

//코멘트 생성
comment_router.post('/api/subject/:subId/:projectId/:feedId/addcomment', (req, res) => {
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
});

//코멘트 삭제
comment_router.delete('/api/:commentId/deletecomment', (req, res) => {
    Comment.findByIdAndDelete({_id: req.params.commentId}, (err, data) => {
        if (err) return res.status(400).send(err);
        return res.status(200).end();
    });
});

// 코멘트 조회
comment_router.get('/api/subject/:subId/:projectId/:feedId/getcomment', (req, res) => {
    Comment.find({ feed_id: req.params.feedId }, (err, data) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(data);
    });
});

  module.exports = comment_router;