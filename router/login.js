/*


        用户登录


*/


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
// 导入加密模块
const crypto = require("crypto");
const { signedCookies } = require('cookie-parser');



router.post('/login', urlencodedParser, function (req, res) {
    //代码文件的根路径
    let Path = path.resolve(__dirname, '..');
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.pwd;
    // 将密码用md5加密映射然后校对
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(pwd).digest("hex");
    // 登陆成功设置cookie
    // 预处理语句查询数据库
    var sql = "SELECT name, password FROM userinfo where email=?";
    var SqlParams = [email];
    // 校验密码
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
                    // 校验密码
                    if (name === result[0].name && newPas === result[0].password) {
                        // 设置cookie
                        // httponly禁止js操作，防御xss攻击
                        // signed给cookie加密
                        res.cookie('name', name, { signed: false, maxAge: 2000 * 1000, httpOnly: true, signed: true });
                        res.cookie('email', email, { signed: false, maxAge: 2000 * 1000, httpOnly: true, signed: true });
                        res.cookie('isLogin', 1, { signed: false, maxAge: 2000 * 1000, httpOnly: true, signed: true });
                        var modSql = 'UPDATE userinfo SET islogin = ? WHERE email = ?';
                        var modSqlParams = [1, email];
                        connection.query(modSql, modSqlParams, function (err, result) {
                            if (err) {
                                console.log('[UPDATE ERROR] - ', err.message);
                                return;
                            }
                        });
                        // 登录成功，跳转到成功界面
                        res.redirect('/loginsuc.html');
                    } else {
                        // 登陆失败，跳转到登录界面
                        res.redirect('/login.html');
                    }
                } else {
                    // 登陆失败，跳转到登录界面
                    res.redirect('/login.html');
                }

            });
        }
    });
})

module.exports=router