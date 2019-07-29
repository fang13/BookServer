import { DBUtils } from "../util/dbUtils"
import { config } from "../config";
var request = require('request')
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

let connection = coMysql(pool);

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
        const libraryList = await connection.query(`SELECT libraryName,owner,location,description FROM Library_table `);
        let totalCount = libraryList.length;
        if (libraryList.length) {
            let returnRes = JSON.stringify({
                    libList: libraryList,
                    total:totalCount
            })
            res.send(returnRes);
        } else {
            res.send('没有图书馆数据');
        }
    } catch (error) {
        console.error(error);
        res.send('发生错误,错误信息' + error);
    }
})

//新增图书馆
router.post('/lib/addLib', async (req, res) => {
   let libraryID =  await connection.query(`SELECT MAX(libraryID) FROM library_table`);
    let joinTime = new Date().toLocaleString('chinese',{hour12:false});
    try {
        const data = await connection.query(`INSERT INTO library_table 
        (libraryID,libraryName,owner,joinTime,location,description)
        VALUES
        ("${libraryID+1}","${req.body.libName}","${req.body.subUnit}","${joinTime}""${req.body.address}","${req.body.description}");`);
        res.send(true);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//图书分类列表
router.get('/bookClassification/getClassification/:parentID', async (req,res)=> {
    let parentID = req.params.parentID;
    let data: any;
    //一级分类 二级分类都是parentID
    try {
        if (parentID) {
             data = await connection.query(`SELECT className FROM BookClass_table WHERE parentID=${parentID} AND isPrimaryClass=0 AND issecondaryClass=1;`);
        } else {
             data = await connection.query(`SELECT className FROM BookClass_table WHERE parentID is NULL AND isPrimaryClass=1 AND issecondaryClass=0;`);
        }
        let resultRes = JSON.stringify({
            bookClassificationList: data,
            total:data.length
        });
        res.send(resultRes);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//新增图书分类
router.post('/bookClassification/addClassification/:parentID', async (req, res) => {
    let parentID = req.params.parentID;
    let className = req.body.classificationName;
    let libraryID =  await connection.query(`SELECT MAX(classID) FROM Class_Table`);
    try {
        const data = await connection.query(`INSERT INTO Class_Table 
            (classID,className,parentID)
            VALUES
            ("${libraryID+1},${className}","${parentID}");`);
        res.send(true);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//修改图书分类
router.put('/bookClassification/updateClassification/:classificationID', async (req, res) => {
    let classificationID = req.params.classificationID;
    let classificationName = req.body.classificationName;
    try {
        const data = await connection.query(`UPDATE bookClass_table SET className='${classificationName}' WHERE parentID=${classificationID};`);
        res.send(true);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//删除图书分类
router.get('/bookClassification/deleteClassification/:classificationID', async (req, res) => {
    let parentID = req.params.classificationID;
    let bookclass = await connection.query(`SELECT className FROM bookClass_Table WHERE parentID=${parentID};`);
    let className = bookclass[0].className;
    let searchData = await connection.query(`SELECT bookName FROM books_table WHERE PrimaryClass='${className}' OR secondaryClass='${className}';`);
    if (searchData) {
        res.send(false);
        res.send('当前分类下有书籍存在,无法删除分类');
        return;
    }
    try {
        const data = await connection.query(`DELETE FROM bookClass_Table WHERE parentID=${parentID};`);
        res.send(true);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//图书列表
router.get('/book/getBookList', async (req, res) => {
    try {
        const data = await connection.query(`SELECT * FROM Books_table;`);
        res.write(JSON.stringify({
            userList: [data],
            total:data.length
        }))
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//查看图书详情
router.get('/book/:bookID', async (req, res) => {
    let bookID = req.params.bookID;
    try {
        const data = await connection.query(`SELECT * FROM Books_table WHERE bookID=${bookID};`);
        let resultRes = JSON.stringify({
            books: data,
            total: data.length
        });
        res.send(resultRes)
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})

//图书历史借还记录
router.get('/book/borrow/:bookID', async (req, res) => {
    let bookID = req.params.bookID;
    try {
        const data = await connection.query(`SELECT * FROM BorrowHistory_table WHERE bookID=${bookID};`);
        let resultRes = JSON.stringify({
            books: data,
            total: data.length
        });
        res.send(resultRes);
    } catch (error) {
        console.error(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
})



//用户列表
router.get('/user/getUserList', async (req, res) => {
    try {
        const data = await connection.query(`SELECT * FROM User_table;`);
        res.write(JSON.stringify({
            userList: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//修改用户状态
router.put('/user/changeState/:userID', async (req, res) => {
    let userID = req.userID;
    let state = req.state;
    try {
        const data = await connection.query(`UPDATE User_Table SET state='${state}' WHERE userID=${userID};`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//修改用户权限
router.put('/user/changePermission/:userID', async (req, res) => {
    let userID = req.userID;
    let permission = req.permission;
    try {
        const data = await connection.query(`UPDATE User_Table SET authority='${permission}' WHERE userID=${userID};`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//用户历史借还记录
router.get('/user/records/:userID', async (req, res) => {
    let userID = req.userID;

    let permission = req.permission;
    try {
        const data = await connection.query(`SELECT * FROM BorrowHistory_table WHERE userID=${userID};`);
        res.write(JSON.stringify({
            records: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})

//管理员列表
router.get('/admin/getAdminList', async (req, res) => {
    try {
        const data = await connection.query(`SELECT adminName FROM Admin_table;`);
        res.write(JSON.stringify({
            records: [data],
            total: data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.writeHead(500);
    }
    res.end();
})


//通过网络查询图书信息，测试
router.get('/testbookInfo', (req, result) => {
    let bookID = '';
   
    request('http://douban.uieee.com/v2/book/isbn/9787570208562', (error,response,body) => {
        if (error) {
            console.log(error);
        }
        console.log(JSON.parse(body));
        result.send(body);
    })
    
})


//小程序端接口
//搜索
router.get('/searchBook/:param',async (req, res) => {
    let param = req.param;
    
})


module.exports = router;
