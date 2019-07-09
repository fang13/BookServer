##  使用命令创建数据说明

切换到数据库bookLib
```sql
use bookLib
```
### 创建**书**数据表
```sql
CREATE TABLE IF NOT EXISTS books(
   id VARCHAR(40) NOT NULL,
   levelOne VARCHAR(40) NOT NULL,
   levelTwo VARCHAR(40) NOT NULL,
   name VARCHAR(40) NOT NULL,
   ISBN VARCHAR(40) NOT NULL,
   author VARCHAR(40) NOT NULL,
   publisher VARCHAR(40) NOT NULL,
   publishDate VARCHAR(40) NOT NULL,
   amount INT UNSIGNED NOT NULL,
   borrowedTimes INT UNSIGNED NOT NULL,
   label VARCHAR(40) NOT NULL,
   descption VARCHAR(200) NOT NULL,
   storeInfo VARCHAR(100) NOT NULL,
   collectionTimes INT UNSIGNED NOT NULL,
   isCanBeBorrowed VARCHAR(40) NOT NULL,
   state VARCHAR(40) NOT NULL,
   borrowHistory VARCHAR(40) NOT NULL,
   PRIMARY KEY ( id, ISBN, name, author )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
###向数据库中插入书籍数据
```sql
INSERT INTO books 
     (id, levelOne, levelTwo, name, ISBN, author, publisher, publishDate, amount, borrowedTimes, label, descption, storeInfo, collectionTimes, isCanBeBorrowed, state, borrowHistory )
     VALUES
     ("123", "测试", "插入书籍测试","围城"， "123456", "钱钟书", "出版者", "出版时间"，10, 20, "标签", "描述", "存储信息", 10, "true", "在管", "借阅历史")
```
###