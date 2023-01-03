// 获取文章
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


router.get('/getallpost', urlencodedParser, function (req, res, next) {
    // 按照时间顺序查询
    var sql = "select * from posts order by date";
    // 插入文章数据
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('和mysql数据库建立连接失败');
        } else {
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                let response = [];
                let content;
                for (var i = 0; i < result.length; i++) {
                    content = md.render(result[i].content);
                    response.push({ "title": result[i].title, "author": result[i].author, "date": result[i].date, "email": result[i].email, "content": content, "heat": result[i].heat, "id": result[i].id, "cover": result[i].cover });
                }
                res.send(JSON.stringify(response));
            });
        }
    });

});


router.get('/gethotpost', urlencodedParser, function (req, res, next) {
    // 按照时间顺序查询
    var sql = "select * from posts order by heat";
    // 插入文章数据
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('和mysql数据库建立连接失败');
        } else {
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                let response = [];
                let content;
                // 读取三篇最热门文章
                let num = 0;
                if(result.length < 3){
                    num = result.length;
                }else{
                    num = 3;
                }
                for (var i = 0; i < num; i++) {
                    content = md.render(result[i].content);
                    response.push({ "title": result[i].title, "author": result[i].author, "date": result[i].date, "email": result[i].email, "content": content, "heat": result[i].heat, "id": result[i].id, "cover": result[i].cover });
                }
                res.send(JSON.stringify(response));
            });
        }
    });

});


router.get('/getmypost', urlencodedParser, function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    let email;
    if (req.query.email) {
        email = req.query.email;
    } else {
        email = req.signedCookies.email;
    }
    // 按照时间查询
    var sql = "select * from posts where email=? order by date";
    var SqlParams = [email];
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('和mysql数据库建立连接失败');
        } else {
            // 插入文章数据
            connection.query(sql, SqlParams, function (err, result) {
                connection.release();
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                let response = [];
                let content;
                for (var i = 0; i < result.length; i++) {
                    content = md.render(result[i].content);
                    response.push({ "title": result[i].title, "author": result[i].author, "date": result[i].date, "email": result[i].email, "content": content, "heat": result[i].heat, "id": result[i].id, "cover": result[i].cover });
                }
                res.send(JSON.stringify(response));
            });
        }
    });
});



module.exports=router