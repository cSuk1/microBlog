// 应用文件
var express = require('express');
var app = express();

// 导入路由模块
const router = require('./router/router');
const loginrouter = require('./router/login');
const logoutrouter = require('./router/logout');
const regrouter = require('./router/reg');
const pubrouter = require('./router/publish');
const getpostrouter = require('./router/getpost');
const inforouter = require('./router/getinfo');
const readrouter = require('./router/read');
const searchrouter = require('./router/search');
app.use('/public', express.static('public'));
const norouter = require('./router/404');


// 注册路由模块，给路由模块添加访问前缀
app.use('/', router);
app.use('/', loginrouter);
app.use('/', logoutrouter);
app.use('/', regrouter);
app.use('/', pubrouter);
app.use('/', getpostrouter);
app.use('/', inforouter);
app.use('/', readrouter);
app.use('/', searchrouter);
app.use('/', norouter);

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})