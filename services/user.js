const pgp = require('pg-promise')({});
const db = pgp('postgres://postgres:123@localhost:5432/blog');
const UserService = {};

UserService.create = (username, email, password) => {
    return db.none('INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${password});', {
        username,
        email,
        password
    });
}
UserService.read = (id) => {
    return db.one('SELECT username FROM users WHERE id=${id}', {
        id
    });
}
UserService.update = (username, email, password, id) => {
    return db.none('UPDATE users SET username = ${username}, email = ${email}, password = ${password} WHERE id=${id}', {
        username,
        email,
        password,
        id
    })
}
UserService.delete = (id) => {
    return db.none('DELETE FROM comments WHERE author = ${id}; DELETE FROM posts WHERE author = ${id}; DELETE FROM users WHERE id = ${id}', {
        id
    });
}
//ALL Read Post by ID
UserService.readPosts = (id) => {
    return db.any('SELECT users.username , posts.* FROM posts JOIN users ON author= users.id WHERE author = ${id};', {
        id
    });
}
//READ SPECIFIC post BY ID
UserService.readPost = (id, post_id) => {
    return db.one('SELECT users.username , posts.* FROM posts JOIN users ON author = users.id WHERE (author = ${id} AND posts.id = ${post_id});', {
        id,
        post_id
    })
}
//ALL COMMENTS by ID
UserService.readComments = (id) => {
    return db.any('SELECT users.username, comments.* FROM comments JOIN users ON author = users.id WHERE author = ${id};'), {
        id
    }
}
//READ COMMENT BY ID
UserService.readComment = (id, comment_id) => {
    return db.any('SELECT users.username, comments.* FROM comments JOIN users ON author = users.id WHERE (author = ${id} AND id = ${comment_id});'), {
        id,
        comment_id
    }
}
//LOGIN
UserService.login = (username) => {
    return db.one('SELECT password FROM users WHERE username = ${username}', {
        username
    })
}
//TOKEN
UserService.token = (username, token) => {
    return db.none('UPDATE users SET token = ${token} WHERE username = ${username}', {
        username,
        token
    })
}
UserService.ckToken = (id) => {
    return db.one('SELECT token FROM users WHERE id = ${id}', {
        id
    })
}
module.exports = UserService;