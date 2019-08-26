
var url = require('url');
var commentDao = require('../dao/CommentDao');
var timeUtil = require('../util/TimeUtil');
var respUtil = require('../util/RespUtil');
var captcha = require('svg-captcha');
var path = new Map();


function addComment(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.insertComment(parseInt(params.bid),parseInt(params.parent),params.parentName,params.userName,params.email,params.content,timeUtil.getNow(),timeUtil.getNow(), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success','评论成功',null));
        response.end();
    });
}
path.set('/addComment', addComment);

function queryRandomCode (request, response) {
    var img = captcha.create({fontSize: 50, width: 100, height: 34});
    response.writeHead(200);
    response.write(respUtil.writeResult('success','success',img));
    response.end();
}
path.set('/queryRandomCode', queryRandomCode);

function queryCommentsByBlogId (request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentsByBlogId(parseInt(params.bid), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success','success',result));
        response.end();
    })
}
path.set('/queryCommentsByBlogId', queryCommentsByBlogId);

function queryNewComments (request, response) {
    commentDao.queryNewComments(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success','success',result));
        response.end();
    })
}
path.set('/queryNewComments', queryNewComments);


module.exports.path = path;