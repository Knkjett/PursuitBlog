const express = require('express');
const commentRouter = express.Router();
const CommentService = require('../services/comment')
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// let userToken = '';
// let currentToken = '';

//POST * CREATE COMMENT BY USER
commentRouter.post('/', (req, res)=>{
    //USER ID
    //POST ID
    const {
        title,
        body
    } = req.body;
    //author grabbed elsewhere
    //post_id grabbed from elsewhere
    CommentService.create(author,post_id,title, body)
    .then(() =>{
        res.json(`Comment Created under ${post_id} by ${user}`)
    })
})
//GET /comment/:comment_id
commentRouter.get('/:id', (req, res)=>{
    const {
        id
    } = req.params;
    CommentService.read(id)
    .then((data) =>{
        res.json(data);
    })
    .catch((err) =>{
        res.json(err.toString());
    })
})
//  PUT /comment/:comment_id PRIVATE
commentRouter.put('/:comment_id', (req, res) => {
    const {
        comment_id
    } = req.params;
    const {
        title,
        body
    } = req.body;
    CommentService.update(title, body, comment_id)
        .then(() => {
            res.json(`Successful Update on comment ${comment_id}`);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
// DEL /comment/:comment_id PRIVATE
commentRouter.delete('/:comment_id', (req, res) => {
    const {
        comment_id
    } = req.params;
    CommentService.delete(comment_id)
        .then(() => {
            res.json("Deleted comment");
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
module.exports = commentRouter;