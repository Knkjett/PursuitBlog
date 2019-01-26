const express = require('express');
const userRouter = express.Router();
const UserService = require('../services/user')
const PostRouter = require('../routes/post')
const CommentRouter = require('../routes/comment')
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const saltRounds = 10;
let userToken = '';
let currentToken = '';

//POST - CREATE USER
userRouter.post('/', (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;
    bcrypt.hash(password, saltRounds)
        .then((hash) => {
            UserService.create(username, email, hash)
                .then(() => {
                    res.json(`Success, ${req.body.username} created.`);
                }, (err) => {
                    if (err.toString().includes("users_username_key"))
                        res.json("Username already in use");
                    if (err.toString().includes("users_email_key"))
                        res.json("Email already in use");
                })
                .catch((err) => {
                    res.json(err.toString());
                })
        })
})

//GET - READ USER
userRouter.get('/:user_id', (req, res) => {
    const {
        user_id
    } = req.params;
    UserService.read(user_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})

//PUT * UPDATE USER
userRouter.put('/:user_id', (req, res) => {
    const {
        user_id
    } = req.params;
    const {
        username,
        email,
        password
    } = req.body
    UserService.ckToken(user_id)
        .then((data) => {
            userToken = Object.values(data)[0];
        })
        .then(() => {
            if (userToken === currentToken) {
                bcrypt.hash(password, saltRounds)
                    .then((hash) => {
                        UserService.update(username, email, hash, user_id)
                            .then(() => {
                                res.json("Successful Update");
                            })
                            .catch((err) => {
                                res.json(err.toString());
                            })
                    })
            } else
                res.json("Incorrect User");
        })
})

//DELETE * DELETE USER
userRouter.delete('/:user_id', (req, res) => {
    const {
        user_id
    } = req.params;
    UserService.ckToken(user_id)
        .then((data) => {
            userToken = Object.values(data)[0];
        })
        .then(() => {
            if (userToken === currentToken) {
                UserService.delete(user_id)
                    .then(() => {
                        res.json("Deleted User");
                    })
                    .catch((err) => {
                        res.json(err.toString());
                    })
            } else
                res.json("Incorrect User");
        })
})

//GET - READ ALL $POSTS
userRouter.get('/:user_id/posts', (req, res) => {
    const {
        user_id
    } = req.params;
    UserService.readPosts(user_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json("User does not exist.");
        })
})

//GET - GET $POST BY user_id
userRouter.get('/:user_id/posts/:post_id', (req, res) => {
    const {
        user_id,
        post_id
    } = req.params;
    UserService.readPost(user_id, post_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json("User or Post does not exist.");
        })
})

//GET - READ ALL COMMENTS
userRouter.get('/:user_id/comments', (req, res) => {
    const {
        user_id
    } = req.params;
    UserService.readComments(user_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})

//GET - GET COMMENT BY user_id
userRouter.get('/:user_id/comments/:comment_id', (req, res) => {
    const {
        user_id,
        comment_id
    } = req.params;
    UserService.readComment(user_id, comment_id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err.toString());
        })
})

// POST - LOGIN
userRouter.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body
    UserService.login(username)
        .then((data) => {
            let returnPass = Object.values(data)
            bcrypt.compare(password, returnPass[0], function (err, confirm) {
                if (confirm) {
                    userToken = shortid.generate();
                    currentToken = userToken;
                    PostRouter.chgToken(currentToken);//Sends Current Token to PostRouter.
                    CommentRouter.chgToken(currentToken);//Sends Current Token to CommentRouter.
                    UserService.token(username, userToken);
                    res.json(`Logged into ${username}`);
                } else
                    res.json("Wrong Username or Password.")
            });
        })
        .catch((err) => {
            res.json(err.toString())
        })
})

module.exports = userRouter;