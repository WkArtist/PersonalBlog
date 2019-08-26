var blogDetail = new Vue({
    el: '#blog_detail',
    data: {
        title: '',
        content: '',
        ctime: '',
        tags: '',
        views: ''
    },
    computed: {
        
    },
    created: function () {
        var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
        if (searchUrlParams == '') {
            return;
        }
        var bid = -10;
        for (var i = 0; i < searchUrlParams.length; i++) {
            if (searchUrlParams[i].split('=')[0] == 'bid') {
                try {
                    bid = parseInt(searchUrlParams[i].split('=')[1]);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        axios({
            method: 'get',
            url: '/queryBlogById?bid='+ bid
        }).then(function (resp) {
            var result = resp.data.data[0];
            blogDetail.title = result.title;
            blogDetail.content = result.content;
            blogDetail.ctime = result.ctime;
            blogDetail.tags = result.tags;
            blogDetail.views = result.views;
        }).catch(function (resp) {
            console.log('请求失败');
        })
    }
})

var sendComment = new Vue({
    el: '#send_comment',
    data: {
        vcode: '',
        rightCode: ''
    },
    computed: {
        changeCode: function () {
          return function () {
              axios({
                  method: 'get',
                  url: '/queryRandomCode'
              }).then(function (resp) {
                  sendComment.vcode = resp.data.data.data;
                  sendComment.rightCode = resp.data.data.text.toLowerCase();
              })
          }  
        },
        sendComment: function () {
            return function () {
                var code = document.getElementById('comment_code').value;
                if (code != sendComment.rightCode) {
                    alert('验证码有误');
                    return;
                }
                var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
                if (searchUrlParams == '') {
                    return;
                }
                var bid = -10;
                for (var i = 0; i < searchUrlParams.length; i++) {
                    if (searchUrlParams[i].split('=')[0] == 'bid') {
                        try {
                            bid = parseInt(searchUrlParams[i].split('=')[1]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }

                var reply = document.getElementById('comment_reply').value;
                var replyName = document.getElementById('comment_reply_name').value;
                var name = document.getElementById('comment_name').value;
                var email = document.getElementById('comment_email').value;
                var content = document.getElementById('comment_content').value;
                axios({
                    method: 'get',
                    url: '/addComment?bid='+bid+'&parent='+reply+'&parentName='+replyName+'&userName='+name+'&email='+email+'&content='+content
                }).then(function (resp) {
                    alert(resp.data.msg);
                });
            }
        }
    },
    created: function () {
        this.changeCode();
    }

})

var blogComment = new Vue({
    el: '#blog_comments',
    data: {
        total: 0,
        comments: []
    },
    computed: {
        reply: function () {
            return function (commentId, userName) {
                document.getElementById('comment_reply').value = commentId;
                document.getElementById('comment_reply_name').value = userName;
                location.href = '#send_comment';
            }
        }
    },
    created: function () {
        var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
        if (searchUrlParams == '') {
            return;
        }
        var bid = -10;
        for (var i = 0; i < searchUrlParams.length; i++) {
            if (searchUrlParams[i].split('=')[0] == 'bid') {
                try {
                    bid = parseInt(searchUrlParams[i].split('=')[1]);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        axios({
            method: 'get',
            url: '/queryCommentsByBlogId?bid='+bid
        }).then(function (resp) {
            blogComment.comments = resp.data.data;
            blogComment.total = resp.data.data.length;
            for (var i = 0; i < blogComment.comments.length; i++) {
                if (blogComment.comments[i].parent > -1) {
                    blogComment.comments[i].options = '回复@'+ blogComment.comments[i].parent_name;
                }
            }
        })
    }
});