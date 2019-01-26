const express = require('express');
const postRouter = express.Router();
const PostService = require('../services/post');
let myToken = '';

//TESTER
//postRouter.get('/', (req, res) => {
    // //Grab currentToken from userRouter
    // //PostService.getAuthor to grab author data. Object.values[0]
    // PostService.getAuthor(myToken)
    // .then((data)=>{
    //     let temp = Object.values(data)
    //     let author = temp[0].toString()
    //     console.log(author)
    // })
    // //Grab Author ID from post_id
    // PostService.getIDfromPost(post_id)
    // .then((data)=>{
    //     let tempid = Object.values(data)[0];
    //     //Grabs Token from post ID to use in IF STATEMENT
    //     PostService.compareToken(tempid)
    //     .then((data)=>{
    //         let tempToken = Object.values(data)[0];
    //         res.json(tempToken);
    //     })
    // })
//})

postRouter.post('/', (req, res) => {
    const {
        title,
        body
    } = req.body;
    //Grab currentToken from userRouter
    //PostService.getAuthor to grab author data. Object.values[0]
    PostService.getAuthor(myToken)
        .then((data) => {
            let author = Object.values(data)[0];
            PostService.create(author, title, body)
                .then(() => {
                    res.json(`Successful post about ${title} created by ${author}`)
                })
                .catch((err) => {
                    res.json(err.toString());
                })
        }, (err) => {
            res.json('Not Logged In.')
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
    //Grab Author ID from post_id
    PostService.getIDfromPost(post_id)
        .then((data) => {
            let tempid = Object.values(data)[0];
            //Grabs Token from post ID to use in IF STATEMENT
            PostService.compareToken(tempid)
                .then((data) => {
                    let tempToken = Object.values(data)[0];
                    if (tempToken === myToken) {
                        //MAIN POST FUNCTION
                        PostService.update(title, body, post_id)
                            .then(() => {
                                res.json(`Successful Update on post ${post_id}`);
                            })
                            .catch((err) => {
                                res.json(err.toString());
                            })
                    } else {
                        res.json("Not logged in or Incorrect user.")
                    }
                }, (err) => {
                    res.json(err.toString());
                })
        })
})
//DEL /post/:post_id PRIVATE
postRouter.delete('/:post_id', (req, res) => {
    const {
        post_id
    } = req.params;
    //Grab Author ID from post_id
    PostService.getIDfromPost(post_id)
        .then((data) => {
            let tempid = Object.values(data)[0];
            //Grabs Token from post ID to use in IF STATEMENT
            PostService.compareToken(tempid)
                .then((data) => {
                    let tempToken = Object.values(data)[0];
                    if (tempToken === myToken) {
                        //MAIN POST FUNCTION
                        PostService.delete(post_id)
                            .then(() => {
                                res.json("Deleted post");
                            })
                            .catch((err) => {
                                res.json(err.toString());
                            })
                    } else {
                        res.json("Not logged in or Incorrect user.")
                    }
                }, (err) => {
                    res.json(err.toString());
                })
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
const chgToken = (thisToken) => {
    myToken = thisToken;
    return myToken;
}

module.exports = {
    postRouter,
    chgToken
};