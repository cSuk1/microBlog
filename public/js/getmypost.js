// mine.ejs页面加载我发布的所有文章
$(document).ready(function () {
    var param = null;
    $(function () {
        //获取参数
        (function ($) {
            $.getUrlParam = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]); return null;
            }
        })(jQuery);
        param = $.getUrlParam('email');
        let theRouter;
        if (param) {
            theRouter = 'getmypost?email=' + param;
        } else {
            theRouter = 'getmypost';
        }
        $.get(theRouter, function (data) {
            // 将json字符串转化成json解析
            var li = JSON.parse(data);
            var len = 50;
            for (var i = 0; i < li.length; i++) {
                // 文章摘要
                if (li[i].content.length < 50) {
                    len = li[i].content.length;
                } else {
                    len = 50;
                }
                // 解析HTML字符串，生成文章描述
                let extras = li[i].content.substr(0, len);
                let gshextras = extras.replace(/<[^>]+>/g, "");
                let lastExtras = gshextras.replace(/[^\u4e00-\u9fa5_0-9]/gi, "");
                // 新增文章元素节点
                // 可能收到xss攻击？
                el = '<a href="getpost?id=' + li[i].id + '" class="col-6 post-items my-post-item"><div class="img"><img src="' + li[i].cover + '" alt="pst-img" class="article-img"></div><div class="content"><h4 class="article-title">' + li[i].title + '</h4><div class="text"><h6>' + li[i].date + '&nbsp;&nbsp;&nbsp;&nbsp;热度:' + li[i].heat + '</h6><p class="article-descri">' + lastExtras + '</p></div></div></a>';
                $("#wenzhangbiaoti").after(el);
            }
        });
    });

});
