var express = require('express');
var router = express.Router();
import { DBUtils } from "../util/dbUtils"

//测试用，添加书籍数据
router.get('/adddata', function(req,res){
    try{
      DBUtils.addBook();
      res.send('添加数据完成');
    }catch(err){
      res.send('添加数据失败');
      res.send(err.message);
    }
    
    
  }) 

     

module.exports = router;
 