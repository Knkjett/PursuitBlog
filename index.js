const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/post', postRouter);
// app.use('/comment', commentRouter);

app.listen(port, ()=>{
    console.log(`Listening. Blog on port: ${port}`)
})