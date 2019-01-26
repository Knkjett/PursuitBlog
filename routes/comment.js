const express = require('express');
const commentRouter = express.Router();
const CommentService = require('../services/comment')
let myToken = '';

// //TESTER
// commentRouter.get('/', (req, res) => {
//     //Grab Author using Token
//     CommentService.getAuthor(myToken)
//         .then((data) => {
//             let author = Object.values(data)[0]
//             res.json(author);
//         })
    
//     //Grab Author ID from comment_id
//     CommentService.getIDfromComment(1)
//         .then((data) => {
//             let tempid = Object.values(data)[0];
//             //Grabs Token from comment ID to use in IF STATEMENT
//             CommentService.compareToken(tempid)
//                 .then((data) => {
//                     let tempToken = Object.values(data)[0];
//                     res.json(tempToken);
//                 })
//         })
// })


//POST * CREATE COMMENT BY USER
commentRouter.post('/', (req, res) => {
    //USER ID
    //POST ID
    const {
        title,
        body,
        post_id
    } = req.body;
    //author grabbed elsewhere
    CommentService.getAuthor(myToken)
        .then((data) => {
            let author = Object.values(data)[0]
            //post_id grabbed from user?? Not sure the full ask
            CommentService.create(author, post_id, title, body)
                .then(() => {
                    res.json(`Comment Created under ${post_id} by ${author}`)
                })
                .catch((err) => {
                    res.json(err.toString())
                })
        })
        .catch((err) => {
            res.json("Not logged in or Incorrect user.")
        })

})
//GET /comment/:comment_id
commentRouter.get('/:id', (req, res) => {
    const {
        id
    } = req.params;
    CommentService.read(id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
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
    //Grab Author ID from comment_id
    CommentService.getIDfromComment(comment_id)
        .then((data) => {
            let tempid = Object.values(data)[0];
            //Grabs Token from comment ID to use in IF STATEMENT
            CommentService.compareToken(tempid)
                .then((data) => {
                    let tempToken = Object.values(data)[0];
                    if (tempToken === myToken) {
                        //MAIN POST FUNCTION
                        console.log(title)
                        console.log(body)
                        console.log(comment_id)
                        CommentService.update(title, body, comment_id)
                            .then(() => {
                                res.json(`Successful Update on comment ${comment_id}`);
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
// DEL /comment/:comment_id PRIVATE
commentRouter.delete('/:comment_id', (req, res) => {
    const {
        comment_id
    } = req.params;
    //Grab Author ID from comment_id
    CommentService.getIDfromComment(comment_id)
        .then((data) => {
            let tempid = Object.values(data)[0];
            //Grabs Token from comment ID to use in IF STATEMENT
            CommentService.compareToken(tempid)
                .then((data) => {
                    let tempToken = Object.values(data)[0];
                    if (tempToken === myToken) {
                        //MAIN POST FUNCTION
                        CommentService.delete(comment_id)
                            .then(() => {
                                res.json("Deleted comment");
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
const chgToken = (thisToken) => {
    myToken = thisToken;
    return myToken;
}

module.exports = {
    commentRouter,
    chgToken
};