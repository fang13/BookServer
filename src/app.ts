import * as express from "express";
import { Util } from "./util/util";
import { DBUtils } from "./util/dbUtils"

Util.init();

let router = express();

router.use((req, res, next) => {
  Util.timeLog();
  next();
})

router.get('/', function (req, res) {
  res.send('Home Page');
})


router.listen(8080, () => {
  console.log("开启服务");
});

//测试用
router.post('/adddata', (req,res) => {
  DBUtils.addBook();
  res.send('添加数据成功');
})
