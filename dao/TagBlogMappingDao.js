var dbutil = require('./DBUtil');

function insertTagBlogMapping(tagId, blogId, ctime, utime, success) {
    var insertSql = "insert into tag_blog_mapping (`tag_id`, `blog_id`,`ctime`,`utime`) values (?,?,?,?)";
    var params = [tagId, blogId, ctime, utime];

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

function queryByTag(tagId,page,pageSize,success) {
    var querySql = "select * from tag_blog_mapping where tag_id = ? limit ?, ?";
    var params = [tagId,pageSize*page,pageSize];

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

function queryByTagCount(tagId, success) {
    var querySql = "select count(1) as count from tag_blog_mapping where tag_id = ?";
    var params = [tagId];

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

module.exports.queryByTagCount = queryByTagCount;
module.exports.queryByTag = queryByTag;
module.exports.insertTagBlogMapping = insertTagBlogMapping;