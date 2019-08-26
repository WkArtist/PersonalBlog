var path = new Map();
var timeUtil = require('../util/TimeUtil');
var respUtil = require('../util/RespUtil');
var blogDao = require('../dao/BlogDao');
var tagsDao = require('../dao/TagsDao');
var TagBlogMappingDao = require('../dao/TagBlogMappingDao');
var url = require('url');

function queryRandomTags(request, response) {
    tagsDao.queryAllTag(function (result) {
        result.sort(() => Math.random() > 0.5 ? true : false);
        response.writeHead(200);
        response.write(respUtil.writeResult('success','查询成功',result));
        response.end();
    })
}
path.set('/queryRandomTags',queryRandomTags);

function queryByTagCount(request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {
        TagBlogMappingDao.queryByTagCount(result[0].id, function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success','查询成功',result));
            response.end();
        });
    })
}
path.set('/queryByTagCount', queryByTagCount);

function queryByTag(request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {
        if (result == null || result.length == 0) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success','查询成功',result));
            response.end();
        } else {
            TagBlogMappingDao.queryByTag(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {
                var blogList = [];
                for (var i = 0;i < result.length;i++) {
                    blogDao.queryBlogById(result[i].blog_id, function (result) {
                        blogList.push(result[0]);
                    })
                }
                getResult(blogList, result.length, response);
            })
        }

    })
}
path.set('/queryByTag', queryByTag);

function getResult (blogList, len, response) {//通过阻塞的方式
    if (blogList.length < len) {
        setTimeout(function () {
            getResult(blogList, len, response);
        }, 10);
    } else {
        for (var i = 0; i < blogList.length; i++) {
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*>/,'');
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g,'');
            blogList[i].content = blogList[i].content.substring(0,300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult('success','查询成功',blogList));
        response.end();
    }
}

module.exports.path = path;