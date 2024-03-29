var dbutil = require('./DBUtil');

function insertComment(blogId, parent,parentName, userName, email, comments, ctime, utime, success) {
    var insertSql = "insert into comments (`blog_id`,`parent`,`parent_name`,`username`,`email`,`comments`,`ctime`,`utime`) values (?,?,?,?,?,?,?,?)";
    var params = [blogId, parent,parentName, userName, email, comments, ctime, utime];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryCommentsByBlogId(blogId,success) {
    var querySql = "select * from comments where blog_id = ?";
    var params = [blogId];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryNewComments(size,success) {
    var querySql = "select * from comments order by id desc limit ?";
    var params = [size];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports.queryNewComments = queryNewComments;
module.exports.insertComment = insertComment;
module.exports.queryCommentsByBlogId = queryCommentsByBlogId;
