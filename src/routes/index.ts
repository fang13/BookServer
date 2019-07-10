var express = require('express');
var router = express.Router();
import { DBUtils } from "../util/dbUtils"

//测试用，添加书籍数据
router.get('/adddata', function(req,res){
    try{
      DBUtils.addBook();
      res.send('添加书籍数据完成');
    }catch(err){
      res.send('添加书籍数据失败');
      res.send(err.message);
    }
  }) 

  //测试用，添加用户数据
router.get('/adduser', function(req,res){
  try{
    DBUtils.addUser();
    res.send('添加用户数据完成');
  }catch(err){
    res.send('添加用户数据失败');
    res.send(err.message);
  }
}) 

 //测试用，添加图书馆数据
 router.get('/addlibrary', function(req,res){
  try{
    DBUtils.addLibrary();
    res.send('添加图书馆数据完成');
  }catch(err){
    res.send('添加图书馆数据失败');
    res.send(err.message);
  }
}) 

     

module.exports = router;
 