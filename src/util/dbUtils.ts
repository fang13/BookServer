var mysql = require('mysql');
import { config } from "../config";
import { connect } from "http2";
import { User } from "../base/user";
import { Book } from "../base/book";

let options = {
    host: config.db_host,
    port: config.db_port,
    user: config.username,
    password: config.password,
    database: config.db_name
};

let connection = mysql.createConnection(options);

export class DBUtils{
   /**
    * sql语句执行
    **/
   public static exec(sqls, values, after){
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
		}
		console.log('connected as id ' + connection.threadId);

		connection.query(sqls || '', values || [], function(err, rows) {
			after(err, rows);
		});
		//关闭数据库连接
		connection.end();
	});
	connection.on('error', function(err) {
		if (err.errno != 'ECONNRESET') {
			after("err01", false);
			throw err;
		} else {
			after("err02", false);
		}
	}); 
   }

   //向数据库中插入书籍数据
   public static addBook(){
    var tableName = 'books';
    var key = '(id, levelOne, levelTwo, name, ISBN, author, publisher, publishDate, amount, borrowedTimes, label, descption, storeInfo, collectionTimes, isCanBeBorrowed, state, borrowHistory )';
    var values = '("123", "测试", "插入书籍测试","围城", "123456", "钱钟书", "出版者", "出版时间", 10, 20, "标签", "描述", "存储信息", 10, "true", "在管", "借阅历史")';
    var addSql = `INSERT INTO ${tableName} \n ${key} \n VALUES \n ${values};`;
    console.log(addSql);
    connection.query(addSql, (err,results) => {
        if (err) {
            console.log('添加书籍失败');
            console.log(err.message);
        }else{
            console.log('添加书籍成功');
        }
    })
   }

   //向数据库中添加用户
   public static addUser(){
    var tableName = 'user';
    var key = '(id,pitcture,name,nickName,jobID,phoneNumber,joinTime,state,authority)';
    var values = '("12345","头像","周","zhou","z5002223","13100001111","2019-3-6","normal","user")';
    var addSql = `INSERT INTO ${tableName} \n ${key} \n VALUES \n ${values};`;
    console.log(addSql);
    connection.query(addSql, (err,results) => {
        if (err) {
            console.log('添加书籍失败');
            console.log(err.message);
        }else{
            console.log('添加书籍成功');
        }
    })
   }

   //向数据库中添加图书馆信息
   public static addLibrary(){
    var tableName = 'library';
    var key = '(id,name,owner,location,description)';
    var values = '("12345","abc图书馆","abc","广东省xx市","这是一个很好的图书馆")';
    var addSql = `INSERT INTO ${tableName} \n ${key} \n VALUES \n ${values};`;
    console.log(addSql);
    connection.query(addSql, (err,results) => {
        if (err) {
            console.log('添加书籍失败');
            console.log(err.message);
        }else{
            console.log('添加书籍成功');
        }
    })
   }

  

    

}