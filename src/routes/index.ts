var express = require('express');
var router = express.Router();
import { DBUtils } from "../util/dbUtils"

//测试用
router.get('/adddata', function(req,res){
    //DBUtils.addBook();
    res.send('添加数据成功');
  }) 


module.exports = router;
