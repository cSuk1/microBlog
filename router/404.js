const express = require('express')
// 创建路由对象，并挂载具体的路由
const router = express.Router()


// 通配符*，当不经过其他路由时404
router.get('*', function (req, res) {
    res.redirect("/404.html");
});

module.exports=router