// 注册
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


router.post('/reg', urlencodedParser, function (req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.pwd;
    // 将密码用md5加密，使用密文存储
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(pwd).digest("hex");
    var sql = "SELECT name FROM userinfo where email=?";
    var SqlParams = [email];
    // 查询是否被注册了
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('和mysql数据库建立连接失败');
        } else {
            connection.query(sql, SqlParams, function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                // 校验是否被注册
                if (result.length != 0) {
                    // 已经被注册，返回注册页面
                    res.redirect('/reg.html');
                } else {
                    // 未被注册
                    // 插入数据
                    var modSql = 'INSERT INTO userinfo (name,email,password,islogin,img) VALUES(?,?,?,?,?)';
                    var modSqlParams = [name, email, newPas, 0, "https://tsuk1pic.oss-cn-chengdu.aliyuncs.com/2022/10/20220930162558b465a82783002558501.jpg"];
                    connection.query(modSql, modSqlParams, function (err, result) {
                        connection.release();
                        if (err) {
                            console.log('[UPDATE ERROR] - ', err.message);
                            return;
                        }
                    });
                    // 注册成功，跳转到登录界面
                    res.redirect('/login.html');
                }
            });
        }
    });

});

module.exports=router