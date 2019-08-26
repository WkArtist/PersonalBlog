var search = new Vue({
    el: '#search',
    data: {

    },
    computed: {
        search: function () {
            return function () {
                var value = document.getElementById('searchInput').value;
                location.href = '?tag='+value;
            }
        }
    }
});

var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tags: []
    },
    computed: {
        randomColor: function () {
            return function () {
                var red = Math.random() * 255;
                var green = Math.random() * 255;
                var blue = Math.random() * 255;
                return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
            }
        },
        randomSize: function () {
            return function () {
                var size = (Math.random() * 20 + 12) + 'px';
                return size;
            }
        }
    },
    created: function () {
        axios({
            method: 'get',
            url: '/queryRandomTags'
        }).then(function (resp) {
            var result = [];
            resp.data.data.forEach(ele => {
                var temp = {};
                temp.tag = ele.tag;
                temp.link = '?tag=' + ele.tag;
                result.push(temp);
            })
            randomTags.tags = result;
        });
    }
});

var newHot = new Vue({
    el: '#new_hot',
    data: {
        titleList: []
    },
    created: function () {
        axios({
            method: 'get',
            url: '/queryBlogByHot?size=5'
        }).then(function (resp) {
            var result = [];
            resp.data.data.forEach(item => {
                var temp = {};
                temp.title = item.title;
                temp.link = '/blog_detail.html?bid=' + item.id;
                result.push(temp);
            });
            newHot.titleList = result;
        });
    }
});

var newComments = new Vue({
    el: '#new_comments',
    data: {
        commentList: []
    },
    created: function () {
        axios({
            method: 'get',
            url: '/queryNewComments'
        }).then(function (resp) {
            var result = [];
            resp.data.data.forEach(item => {
                var temp = {};
                temp.name = item.username;
                temp.date = item.ctime;
                temp.comment = item.comments;
                result.push(temp);
            });
            newComments.commentList = result;
        })
    }
});