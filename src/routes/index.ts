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


//后台接口
//登录接口
router.post('/login', async (req, res)=> {
    let username = req.query.username;
    let password = req.query.password;
    let response: any;
    if (username == 'admin' && password == 'admin') {
        res.send(true);
    } else {
        res.send(false);
    }
    // try {
    // //根据用户名查询
    //     const data = await connection.query(`SELECT username, password FROM Admin_table WHERE username='${username}'`);
    // if (!data.length) {
    //     // 用户不存在
    //     res.write(JSON.stringify({
    //         error: 1,
    //         msg: '用户名或密码错误'
    //     }))
    // } else if (data[0].password !== password) {
    //     //密码不正确
    //     res.write(JSON.stringify({
    //         error: 1,
    //         msg: '用户名或密码错误'
    //     }))
    // } else {
    //     //登录成功
    //     res.write(JSON.stringify({
    //         error: 0,
    //         msg: '登录成功'
    //       }))
    // }
    // } catch (error) {
    //     console.error(error);
    //     res.writeHead(500);
    // }

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
    
    let libraryID = await connection.query(`SELECT MAX(libraryID) FROM library_table`);
    if (!libraryID) {
        //如果ID不存在，则说明是第一条记录
        const baseID = 300;
        libraryID = 300;
    }
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
    let libraryID = await connection.query(`SELECT MAX(classID) FROM Class_Table`);
    if (!libraryID) {
        //如果ID不存在，则说明是第一条记录
        const baseID = 500;
        libraryID = 500;
    }
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
        res.send('发生错误,错误信息' + error);
    }
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
        res.send('发生错误,错误信息' + error);
    }
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
        res.send('发生错误,错误信息' + error);
    }

})

//用户历史借还记录
router.get('/user/records/:userID', async (req, res) => {
    let userID = req.userID;
    try {
        const data = await connection.query(`SELECT * FROM BorrowHistory_table WHERE userID=${userID};`);
        res.write(JSON.stringify({
            records: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }
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
        res.send('发生错误,错误信息' + error);
    }
})

//标签列表
router.get('/labelList', async (req, res) => {
    try {
        const data = await connection.query(`SELECT labelName FROM labels_table;`);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//给图书添加标签
router.get('/addBookLabel/:bookID', async (req, res) => {
    let bookID = req.params.bookID;
    let addlabel = req.body.addlabel;

    try {
        const data = await connection.query(`UPDATE books_table SET label=CONCAT(label,${addlabel}) WHERE bookID=${bookID};`);
        res.write(JSON.stringify({
            records: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//给图书移除标签
router.get('/addBookLabel/:bookID', async (req, res) => {
    let bookID = req.params.bookID;
    let removelabel = req.body.removelabel;

    try {
        const data = await connection.query(`UPDATE books_table SET label=REPLACE(label,${removelabel},'') WHERE bookID=${bookID};`);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//新增标签
router.get('/addLabel/', async (req, res) => {
    let label = req.body.label;
    let labelID = await connection.query(`SELECT MAX(labelID) FROM labels_table`);
    if (!labelID) {
        //如果ID不存在，则说明是第一条记录
        labelID = 700;
    }
    try {
        const data = await connection.query(`INSERT INTO labels_table 
        (labelID,labelName)
        VALUES
        (${labelID + 1},${label});`);
        
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//删除标签
router.get('/deleteLabel/:labelID', async (req, res) => {
    let labelID = req.params.labelID;
    if (!labelID) {
        //如果ID不存在，则说明是第一条记录
        res.send(false)
        res.send('标签不存在');
    }
    try {
        const data = await connection.query(`DELETE FROM labels_table WHERE labelID=${labelID};`);
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//标签下所有图书列表
router.get('/bookLabelList/:labelID', async (req, res) => {
    let labelID = req.params.labelID;
    if (!labelID) {
        //如果ID不存在，则说明是第一条记录
        res.send(false)
        res.send('标签不存在');
    }
    try {
        const data = await connection.query(`SELECT * FROM books_table WHERE label LIKE CONCAT('%',(SELECT labelName FROM labels_table WHERE labelID=${labelID}),'%');`);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
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

//首页banner图
router.post('/getBanner',async (req, res) => {
    
    
})

//搜索 (书名，ISBN,作者)
router.get('/getBookList',async (req, res) => {
    let temp = req.body.params;
    let params = JSON.parse(temp);
    let queryStr: string;
    if (params.bookName) {
        // Select * From books_table Where bookID In (Select MIN(bookID) From books_table Group By bookName)
        queryStr = `Select * From books_table Where bookID In (Select MIN(bookID) From (Select * From books_table Where bookName like %${params.bookName}%)) Group By bookName;`;
    } else if (params.author) {
        queryStr = `Select * From books_table Where bookID In (Select MIN(bookID) From (Select * From books_table Where author like %${params.author}%)) Group By bookName;`;
    } else if (params.ISBN) {
        queryStr = `Select * From books_table Where bookID In (Select MIN(bookID) From (Select * From books_table Where ISBN10 like %${params.ISBN}%)) Group By bookName;`;
    } else {
        return;
    }

    try {
        const data = await connection.query(queryStr);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
    
})


//图书分类列表
router.get('/getClassificationList/:parentId', async (req, res) => {
    let parentId = req.params.parentId;
    let className = await connection.query(`SELECT className FROM bookClass_table WHERE parentId IS NULL`);
    let queryStr: string;
    if (!parentId) {
        //如果ID不存在，则说明是一级分类
        queryStr = `SELECT className FROM books_table WHERE PrimaryClass LIKE %${className}%;`
    }
    try {
        const data = await connection.query(`SELECT * FROM books_table WHERE label LIKE CONCAT('%',(SELECT labelName FROM labels_table WHERE labelID=${parentId}),'%');`);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//热门收藏
router.get('/book/hotCollection', async (req, res) => {
    try {
        const data = await connection.query(`SELECT bookName FROM labels_table WHERE label LIKE %热门收藏%);`);
        res.send(JSON.stringify({
            records: [data],
            total:data.length
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }    
})

//最新上架
router.get('/book/newArrival', async (req, res) => {
    
})

//图书详情
router.get('/book/bookDetail/:userId', async (req, res) => {
    let bookID = req.body.bookID
    try {
        const data = await connection.query(`SELECT * FROM books_table WHERE bookID=${bookID};`);
        res.send(JSON.stringify({
            bookDetailList: [data]
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
})

//我的收藏
router.get('/user/myCollection/:userId', async (req, res) => {
    let userID = req.params.userID
    try {
        const data = await connection.query(`SELECT * FROM collection_table WHERE userID=${userID};`);
        res.send(JSON.stringify({
            myCollectionList: [data]
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
})
//收藏/取消收藏
router.get('/book/changeColectionState/:userId', async (req, res) => {
    let userID = req.params.userID
    try {
        const data = await connection.query(`SELECT * FROM collection_table WHERE userID=${userID};`);
        res.send(JSON.stringify({
            myCollectionList: [data]
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
})

//借阅中

//已归还

//现有图书馆列表

//还原图书位置

//保存用户信息(注册)
router.post('/user/save',async (req, res) => {
    let userParams = req.body.userParams;
    try {
        let userID = await connection.query(`SELECT MAX(userId) FROM user_table`);
        if (!userID) {
            userID = 200;
        }
        const data = await connection.query(`INSERT INTO user_table 
        (userID,profilePicture,userName,nickName,jobID,phoneNumber,joinTime,state,authority)
        VALUES
        (${userID+1},"头像","周","zhou","z5002223","13100001111","2019-3-6 20:50:20","normal","user");`);
        res.send(JSON.stringify({
            userInfo: [data],
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
    
})

//异常书籍列表

//点击头像获取用户信息
router.get('/user/:userId',async (req, res) => {
    let userId = req.params.userId;
    try {
      
        const data = await connection.query(`SELECT * FROM user_table WHERE userId=${userId};`);
        res.send(JSON.stringify({
            userInfo: [data],
        }))
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
        res.send('发生错误,错误信息' + error);
    }  
    
})




module.exports = router;
