// article.html页面加载所有文章
$(document).ready(function () {
    $.get("gethotpost", function (data) {
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
            el = '<a href="getpost?id=' + li[i].id + '" class="col-4 post-items best-article"><div class="img"><img src="' + li[i].cover + '" alt="pst-img" class="barticle-img"></div><div class="content"><h4 class="article-title">' + li[i].title + '</h4><div class="text"><h6>' + li[i].author + '&nbsp;发布于&nbsp;' + li[i].date + '&nbsp;&nbsp;&nbsp;&nbsp;热度:' + li[i].heat + '</h6><p class="article-descri">' + lastExtras + '</p></div></div></a>';
            $("#remen").after(el);
        }
    });
});
