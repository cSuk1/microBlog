// 阅读
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


router.get('/getpost', urlencodedParser, function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    let id = req.query.id;
    var sql = "select title,author,date,email,content,heat from posts where id=?";
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
                // 被观看，更新热度
                let heat = result[0].heat + 1;
                var modSql = 'UPDATE posts SET heat=? WHERE id = ?';
                var modSqlParams = [heat, id];
                connection.query(modSql, modSqlParams, function (err, result) {
                    if (err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }
                });
                // 返回渲染的界面
                let response = [];
                response.push({ "title": result[0].title, "author": result[0].author, "date": result[0].date, "email": result[0].email, "content": result[0].content, "heat": result[0].heat, "id": id });
                // 将文本渲染成Markdown格式
                let content = md.render(result[0].content);
                // res.send(JSON.stringify(response));
                // ejs渲染页面
                // 访问者非作者
                let author = '<a href="getinfo?email=' + result[0].email + '">作者：<svg class="icon navicon" aria-hidden="true"><use xlink:href="#icon-biaozhang"></use></svg>' + result[0].author + '</a>';
                if (req.signedCookies.email != result[0].email) {
                    res.render('post.ejs', {
                        title: result[0].title,
                        date: result[0].date,
                        heat: result[0].heat,
                        author: author,
                        content: content,
                        btn: "",
                    });
                } else {
                    let btn = '<div class="btn-group"><a href="editpost?id=' + id + '"><button type="button" class="btn btn-warning">修改文章</button></a><a href="delpost?id=' + id + '"><button type="button" class="btn btn btn-danger">删除文章</button></a></div>';
                    res.render('post.ejs', {
                        title: result[0].title,
                        date: result[0].date,
                        heat: result[0].heat,
                        author: author,
                        content: content,
                        btn: btn,
                    });
                }

            });
        }
    });

});



module.exports=router