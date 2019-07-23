import * as express from "express";
import { Util } from "./util/util";

var routes=require('./routes/index');
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
Util.init();
var app = express();

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

