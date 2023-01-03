// 发布文章
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


// 发布
router.post('/postacticle', urlencodedParser, function (req, res, next) {
    let name = req.signedCookies.name;
    let email = req.signedCookies.email;
    let title = req.body.posttitle;
    let content = req.body.postcontent;
    let cover = req.body.postcover;
    // 生成毫秒时间戳，用于唯一标识文章
    let id = Date.now();
    // 获取当前时间
    const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    var sql = "INSERT INTO posts (title,author,date,email,content,heat,id,cover) VALUES(?,?,?,?,?,?,?,?)";
    var SqlParams = [title, name, time, email, content, 0, id, cover];
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
                res.redirect('/publish.html');
            });
        }
    });

});

// 删除
router.get('/delpost', urlencodedParser, function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 获取操作者邮箱和文章id
    let email = req.signedCookies.email;
    let id = req.query.id;
    var sql = "select email from posts where id=?";
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
                // 比对作者邮箱与操作者邮箱，防止csrf攻击
                if (email == result[0].email) {
                    // 相同则执行删除操作
                    var delsql = "DELETE FROM posts where id=?";
                    var delSqlParams = [id];
                    connection.query(delsql, delSqlParams, function (err, result) {
                        if (err) {
                            console.log('[SELECT ERROR] - ', err.message);
                            return;
                        }
                        res.redirect('/loginsuc.html');
                    });
                } else {
                    // 不同
                    let ad = '/getpost?id=' + id;
                    res.redirect(ad);
                }
            });
        }
    });


});




module.exports=router