var mysql = require('mysql');
import { config } from "../config";


export class DB{
   public static options;
   constructor(){
    DB.options = {
        host: config.db_host,
        port: config.db_port,
        user: config.username,
        password: config.password,
        database: config.db_name
    };
   };

   /**
    * sql语句执行
    **/
   public static exec(sqls, values, after){
    var connection = mysql.createConnection(DB.options);
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
}