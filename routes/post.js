const express = require('express');
const postRouter = express.Router();
const PostService = require('../services/post');
const userRouter = require('../routes/user')
let myToken = '';
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// let userToken = '';
// let currentToken = '';

//TESTER
postRouter.get('/', (req, res) => {
    //  userRouter.// GRABS TOKEN FROM USER.
    // .then((data) => {
    //     myToken = Object.values(data)[0];
    //     res.json(myToken);
    // })
 
})
postRouter.post('/', (req, res) => {
    const {
        title,
        body
    } = req.body;
    //author grabbed from elsewhere
    PostService.create(author, title, body)
        .then(() => {
            res.json(`Successful post about ${title} created`)
        })
        .catch((err) => {
            res.json(err.toString());
        })
})

//GET /post/:post_id
postRouter.get('/:post_id', (req, res) => {
    const {
        post_id
    } = req.params;
    PostService.read(post_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
// PUT /post/:post_id PRIVATE
postRouter.put('/:post_id', (req, res) => {
    const {
        post_id
    } = req.params;
    const {
        title,
        body
    } = req.body;
    PostService.update(title, body, post_id)
        .then(() => {
            res.json(`Successful Update on post ${post_id}`);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
// x DEL /post/:post_id
postRouter.delete('/:post_id', (req, res) => {
    const {
        post_id
    } = req.params;
    PostService.delete(post_id)
        .then(() => {
            res.json("Deleted post");
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
// GET /post/:post_id/comments
postRouter.get('/:post_id/posts', (req, res) => {
    const {
        post_id
    } = req.params;
    PostService.readComments(post_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})
// GET /post/:post_id/comments/:comment_id
postRouter.get('/:post_id/comments/:comment_id', (req, res) => {
    const {
        post_id,
        comment_id
    } = req.params;
    PostService.readComment(post_id, comment_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})


module.exports = postRouter;