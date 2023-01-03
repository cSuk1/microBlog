// 用户信息
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


// 个人信息
router.get('/getinfo', urlencodedParser, function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    if (req.signedCookies.isLogin == 1) {
        let email;
        if (req.query.email) {
            email = req.query.email;
        } else {
            email = req.signedCookies.email;
        }
        var sql = "select name,password,email,img from userinfo where email=?";
        var SqlParams = [email];
        pool.getConnection((err, connection) => {
            connection.release();
            if (err) {
                console.log('和mysql数据库建立连接失败');
            } else {
                connection.query(sql, SqlParams, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }
                    // 返回渲染的界面
                    // ejs渲染页面
                    let touxiang = '<img src="' + result[0].img + '" alt="touxiang" class="touxiang">';
                    let name = '<h3 class="nickname">' + result[0].name + '</h3>';
                    let uemail = '<h3 class="useremail">' + result[0].email + '</h3>';
                    if (req.signedCookies.email != email) {
                        res.render('myinfo.ejs', {
                            name: name,
                            email: uemail,
                            img: touxiang,
                            btn: "",
                        });
                    } else {
                        let btn = '<div class="btn-group"><a href="editinfo?email=' + email + '"><button type="button" class="btn btn-warning">修改信息</button></a></div>';
                        res.render('myinfo.ejs', {
                            name: name,
                            email: uemail,
                            img: touxiang,
                            btn: btn,
                        });
                    }

                });
            }
        });
    } else {
        res.redirect('/login.html');
    }

});


router.get('/editinfo', urlencodedParser, function (req, res, next) {
    let email;
    if (req.signedCookies.email == req.query.email) {
        email = req.query.email;
        var sql = "select name,password,img from userinfo where email=?";
        var SqlParams = [email];
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
                    let tx = '<img src="' + result[0].img + '" alt="touxiang" class="touxiang">';
                    res.render('editinfo.ejs', {
                        touxiang: tx,
                        name: result[0].name,
                        email: email,
                        img: result[0].img,
                        pwd: result[0].password,
                    });
                });
            }
        });
    } else {
        res.redirect('/getinfo');
    }

});


// 修改
router.post('/edit', urlencodedParser, function (req, res, next) {
    let name = req.body.name;
    let email = req.signedCookies.email;
    let img = req.body.img;
    if (req.body.pwd) {
        let pwd = req.body.pwd;
        let md5 = crypto.createHash("md5");
        let newpwd = md5.update(pwd).digest("hex");
        var sql = "UPDATE userinfo SET name=?,img=?,password=? WHERE email = ?";
        var SqlParams = [name, img, newpwd, email];
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
                    res.redirect('/getinfo');
                });
            }
        });
    } else {
        var sql = "UPDATE userinfo SET name=?,img=? WHERE email = ?";
        var SqlParams = [name, img, email];
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
                    res.redirect('/getinfo');
                });
            }
        });
    }


});



module.exports=router