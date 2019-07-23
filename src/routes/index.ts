import { DBUtils } from "../util/dbUtils"
import { config } from "../config";
var express = require('express');
var router = express.Router();

const coMysql = require('co-mysql');
var mysql = require('mysql');
const pool = mysql.createPool({
  host: config.db_host,
  port: config.db_port,
  user: config.username,
  password: config.password,
  database: config.db_name
}) 

let connection = coMysql.createConnection(pool);

//测试用，添加书籍数据
router.get('/adddata', function (req, res) {
    try {
        DBUtils.addBook();
        res.send('添加书籍数据完成');
    } catch (err) {
        res.send('添加书籍数据失败');
        res.send(err.message);
    }
})

//测试用，添加用户数据
router.get('/adduser', function (req, res) {
    try {
        DBUtils.addUser();
        res.send('添加用户数据完成');
    } catch (err) {
        res.send('添加用户数据失败');
        res.send(err.message);
    }
})

//测试用，添加图书馆数据
router.get('/addlibrary', function (req, res) {
    try {
        DBUtils.addLibrary();
        res.send('添加图书馆数据完成');
    } catch (err) {
        res.send('添加图书馆数据失败');
        res.send(err.message);
    }
})

//测试用，查询收据
router.get('/searchData', function (req, res) {
    let key = ["name"];
    let table = ["books"];
    try {
        let result = DBUtils.searchData(table, key);
        console.log(result);
        res.send('查询数据完成');
    } catch (err) {
        res.send('查询数据失败');
        res.send(err.message);
    }
})

//后台接口
//登录接口
router.post('/login', async (req, res)=> {
    let username = req.query.username;
    let password = req.query.password;
    let response: any;

    try {
    //根据用户名查询
        const data = await connection.query(`SELECT username, password FROM Admin_table WHERE username='${username}'`);
    if (!data.length) {
        // 用户不存在
        res.write(JSON.stringify({
            error: 1,
            msg: '用户名或密码错误'
        }))
    } else if (data[0].password !== password) {
        //密码不正确
        res.write(JSON.stringify({
            error: 1,
            msg: '用户名或密码错误'
        }))
    } else {
        //登录成功
        res.write(JSON.stringify({
            error: 0,
            msg: '登录成功'
          }))
    }
    } catch (error) {
        console.error(error);
        res.writeHead(500);
    }
    res.end();
})

//查询图书馆列表
router.get('/lib/getLibList', async (req, res) => {
    try {
        const data = await connection.query(`SELECT libraryName FROM Library_table `);
        res.write(JSON.stringify(data));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
    }
    res.end();
})

//新增图书馆
router.post('/lib/addLib', async (req, res) => {
    var UUID = require('uuid');
    var ID = UUID.v1();
    try {
        const data = await connection.query(`INSERT INTO library 
        (id,name,owner,location,description)
        VALUES
        ("${ID}","${req.body.libName}","${req.body.subUnit}","${req.body.address}","${req.body.description}");`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//图书分类列表
router.get('/bookClassification/getClassification/:parentID', async (req,res)=> {
    let parentID = req.parentID;

    //一级分类 二级分类调教都是parentID
    try {
        const data = await connection.query(`SELECT className FROM BookClass_table WHERE parentID="${parentID}"`);
        res.write(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        res.writeHead(500);
    }
    res.end();
})

//新增图书分类
router.post('/bookClassification/addClassification/:parentID', async (req, res) => {
    let parentID = req.parentID;
    let className = req.body.classificationName;
    try {
        const data = await connection.query(`INSERT INTO Class_Table 
            (className,parentID)
            VALUES
            ("${className}","${parentID}");`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//修改图书分类
router.put('/bookClassification/updateClassification/:classificationID', async (req, res) => {
    let classificationID = req.classificationID;
    let classificationName = req.body.classificationName;
    try {
        const data = await connection.query(`UPDATE Class_Table SET className='${classificationName}' WHERE parentID=${classificationID};`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//删除图书分类
router.put('/bookClassification/deleteClassification/:classificationID', async (req, res) => {
    let parentID = req.classificationID;
    try {
        const data = await connection.query(`DELETE FROM Class_Table WHERE parentID=${parentID};`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

module.exports = router;
