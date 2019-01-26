const pgp = require('pg-promise')({});
const db = pgp('postgres://postgres:123@localhost:5432/blog');
const PostService = {};

PostService.create = (author, title, body) =>{
    return db.none('INSERT INTO posts (author, title, body) VALUES (${author}, ${title}, ${body});', {
        author,
        title,
        body
    });
}
PostService.read = (post_id) => {
    return db.one('SELECT * FROM posts WHERE id=${post_id};',{
        post_id
    });
}
PostService.update = (title, body, post_id) =>{
    return db.none('UPDATE posts SET title = ${title}, body = ${body} WHERE id=${post_id}', {
        title,
        body,
        post_id
    })
}
PostService.delete = (post_id) => {
    return db.none ('DELETE FROM comments WHERE post_id = ${post_id}; DELETE FROM posts WHERE id = ${post_id}', {
        post_id
    })
}
//GET /post/:post_id/comments
PostService.readComments = (post_id) =>{
    return db.any('SELECT posts.author , comments.* FROM comments JOIN posts ON id=author WHERE post_id = ${post_id};', {
        post_id
    });
}
//GET /post/:post_id/comments/:comment_id
PostService.readComment = (post_id,comment_id) =>{
    return db.one('SELECT posts.author , comments.* FROM comments JOIN posts ON post_id=author WHERE (id = ${post_id} AND comments.id = ${comment_id});', {
        post_id,
        comment_id
    });
}
//Grab Author
PostService.getAuthor = () =>{
    
}
module.exports = PostService;