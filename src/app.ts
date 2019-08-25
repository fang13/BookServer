import express = require("express");
import { Util } from "./util/util";

var routes=require('./routes/index');
var bodyparser = require("body-parser")

Util.init();
var app = express();
var session = require('express-session');

app.use('/public', express.static('/public'));
app.use((req, res, next) => {
  Util.timeLog();
  next(); 
})

// 登录校验
// app.use(bodyparser.json()); // 使用bodyparder中间件，
// app.use(bodyparser.urlencoded({ extended: true }));

// // 使用 session 中间件
// app.use(session({
//     secret :  'secret', // 对session id 相关的cookie 进行签名
//     resave : true,
//     saveUninitialized: false, // 是否保存未初始化的会话
//     cookie : {
//         maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
//     },
// }));
// // 参考链接：https://www.cnblogs.com/mingjiatang/p/7495321.html

app.all("*",function (req,res,next) {
    
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","*");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");

  next();
});

    
app.get('/', function (req, res) {
  res.send('Home Page');
})

app.use('/',routes);

app.listen(8080, () => {
  console.log("开启服务 hello");
});

