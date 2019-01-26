const pgp = require('pg-promise')({});
const db = pgp('postgres://postgres:123@localhost:5432/blog');
const CommentService = {};


// POST /comment
CommentService.create = (author, post_id, title, body) => {
    return db.none('INSERT INTO comments (author, post_id, title, body) VALUES (${author}, ${post_id}, ${title}, ${body});', {
        author,
        post_id,
        title,
        body
    });
}

// GET /comment/:comment_id
CommentService.read = (comment_id) => {
    return db.one('SELECT * FROM comments WHERE id=${comment_id};', {
        comment_id
    });
}
// PUT /comment/:comment_id
CommentService.update = (title, body, comment_id) => {
    return db.none('UPDATE comments SET title = ${title}, body = ${body} WHERE id=${comment_id}', {
        title,
        body,
        comment_id
    })
}
// DEL /comment/:comment_id
CommentService.delete = (comment_id) => {
    return db.none('DELETE FROM comments WHERE id = ${comment_id}', {
        comment_id
    });
}
CommentService.getAuthor = (token) => {
    return db.one('SELECT id FROM users WHERE token = ${token}', {
        token
    });
}
CommentService.getIDfromComment = (comment_id) =>{
    return db.one('SELECT author FROM comments WHERE id = ${comment_id}',{
        comment_id
    })
}
CommentService.compareToken = (id) =>{
    return db.one ('SELECT token FROM users WHERE id = ${id}',{
        id
    });
}
module.exports = CommentService;