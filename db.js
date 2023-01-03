// 连接配置文件
var mysql = require('mysql');

// 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pwd',
  database: 'microBlog'
});

module.exports = pool;