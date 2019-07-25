import express = require("express");
import { Util } from "./util/util";

var routes=require('./routes/index');
var bodyParser = require("body-parser")

Util.init();
var app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use((req, res, next) => {
  Util.timeLog();
  next(); 
})

app.get('/', function (req, res) {
  res.send('Home Page');
})

app.use('/',routes);

app.listen(8080, () => {
  console.log("开启服务 hello");
});

