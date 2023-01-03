// 搜索
// 导入express模块
const express = require('express')
// 引入path模块
let path = require('path')
// 数据库
mysql = require('mysql');
let pool = require('../db');
// 创建 application/x-www-form-urlencoded 编码解析
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// 创建路由对象，并挂载具体的路由
const router = express.Router()
// 引入cookie
let util = require('util');
let cookieParser = require('cookie-parser')
router.use(cookieParser('tsuk1'))
// 引入时间依赖
const sd = require('silly-datetime');
// 引入Markdown渲染器
// node.js, "classic" way:
let MarkdownIt = require('markdown-it'), md = new MarkdownIt();
// 导入加密模块
const crypto = require("crypto");
const { signedCookies } = require('cookie-parser');


router.post('/search', urlencodedParser, function (req, res, next) {
    var sql = "select * from posts where title=? order by date";
    let id = req.body.title;
    var SqlParams = [id];
    // 插入文章数据
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('和mysql数据库建立连接失败');
        } else {
            connection.query(sql, SqlParams, function (err, result) {
                connection.release();
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                if (result.length > 0) {
                    let response = "";
                    let content;
                    let len = 100;
                    for (var i = 0; i < result.length; i++) {
                        content = md.render(result[i].content);
                        if (content < 100) {
                            len = li[i].content.length;
                        } else {
                            len = 100;
                        }
                        el = '<a href="getpost?id=' + result[i].id + '" class="col-6 post-items"><div class="img"><img src="' + result[i].cover + '" alt="pst-img" class="article-img"></div><div class="content"><h4 class="article-title">' + result[i].title + '</h4><div class="text"><h6>' + result[i].author + '&nbsp;发布于&nbsp;' + result[i].date + '&nbsp;&nbsp;&nbsp;&nbsp;热度:' + result[i].heat + '</h6><p class="article-descri">' + content.substr(0, len) + '</p></div></div></a>';
                        response = response + el;
                    }
                    res.render('search.ejs', {
                        response: response,
                    });
                } else {
                    res.redirect('/404.html');
                }

            });
        }
    });


});


module.exports=router