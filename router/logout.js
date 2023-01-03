// 用户登出


// 导入express模块
const express = require('express')
// 引入path模块
let path = require('path')
// 数据库
mysql = require('mysql');
let pool = require('../db');

// 创建路由对象，并挂载具体的路由
const router = express.Router()
// 引入cookie
let util = require('util');
let cookieParser = require('cookie-parser')
router.use(cookieParser('tsuk1'))


router.get('/logout', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 销毁cookie
    res.clearCookie("name");
    res.clearCookie("email");
    res.clearCookie("isLogin");
    // 回到未登录的默认页面
    res.redirect('/');

});

module.exports=router