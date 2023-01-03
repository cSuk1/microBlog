/*

        引入外部资源

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
// 引入时间依赖
const sd = require('silly-datetime');
// 引入Markdown渲染器
// node.js, "classic" way:
let MarkdownIt = require('markdown-it'), md = new MarkdownIt();
// 导入加密模块
const crypto = require("crypto");
const { signedCookies } = require('cookie-parser');


/*

        views层html文档的路由

*/

// 默认页面路由，登录为loginsuc.html，否则index.html
router.get('/', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.sendFile(Path + "/views/loginsuc.html");
    } else {
        res.sendFile(Path + "/views/index.html");
    }
});

// 登录页面路由
router.get('/login.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.sendFile(Path + "/views/loginsuc.html");
    } else {
        res.sendFile(Path + "/views/login.html");
    }
});

// 注册界面
router.get('/reg.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    res.sendFile(Path + "/views/reg.html");
});

// 默认页面
router.get('/index.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.sendFile(Path + "/views/loginsuc.html");
    } else {
        res.sendFile(Path + "/views/index.html");
    }
});

// 登陆成功路由，如果未登录，则回到index.html
router.get('/loginsuc.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // res.sendFile(Path + "/views/loginsuc.html");
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.sendFile(Path + "/views/loginsuc.html");
    } else {
        res.sendFile(Path + "/views/index.html");
    }
});

// 发布文章界面
router.get('/publish.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // res.sendFile(Path + "/views/loginsuc.html");
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.sendFile(Path + "/views/publish.html");
    } else {
        res.sendFile(Path + "/views/login.html");
    }
});

// 文章展示界面
router.get('/article.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..');
    res.sendFile(Path + "/views/article.html");
});

// 个人界面
router.get('/mine.ejs', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.render("mine.ejs");
    } else {
        res.sendFile(Path + "/views/login.html");
    }
});

// 文章阅读界面
router.get('/post.ejs', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    res.sendFile(Path + "/views/post.ejs");
});

// 个人信息界面
router.get('/myinfo.ejs', function (req, res, next) {
    let Path = path.resolve(__dirname, '..');
    // 检查cookie登录状态
    if (req.signedCookies.isLogin == 1) {
        res.render("myinfo.ejs");
    } else {
        res.sendFile(Path + "/views/login.html");
    }
});

// 404
router.get('/404.html', function (req, res, next) {
    let Path = path.resolve(__dirname, '..'); //代码文件的根路径
    res.sendFile(Path + "/views/404.html");
});



// 向外导出路由
module.exports = router