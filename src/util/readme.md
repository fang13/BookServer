##  使用命令创建数据说明

切换到数据库bookLib
```sql
use bookLib
```

## 创建数据表
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
### 创建**用户**数据表
```sql
CREATE TABLE IF NOT EXISTS user(
   id VARCHAR(40) NOT NULL,
   pitcture VARCHAR(40) NOT NULL,
   name VARCHAR(40) NOT NULL,
   nickName VARCHAR(40) NOT NULL,
   jobID VARCHAR(40) NOT NULL,
   phoneNumber VARCHAR(40) NOT NULL,
   joinTime VARCHAR(40) NOT NULL,
   state VARCHAR(40) NOT NULL,
   authority VARCHAR(40) NOT NULL,
   PRIMARY KEY ( id, jobID, name, state,nickName)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 创建**图书馆**数据表
```sql
CREATE TABLE IF NOT EXISTS library(
   id VARCHAR(40) NOT NULL,
   name VARCHAR(40) NOT NULL,
   owner VARCHAR(40) NOT NULL,
   location VARCHAR(200) NOT NULL,
   description VARCHAR(200) NOT NULL,
   PRIMARY KEY ( id,name)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## 插入数据
### 向数据库中插入**书籍**数据
```sql
INSERT INTO books 
     (id, levelOne, levelTwo, name, ISBN, author, publisher, publishDate, amount, borrowedTimes, label, descption, storeInfo, collectionTimes, isCanBeBorrowed, state, borrowHistory )
     VALUES
     ("123", "测试", "插入书籍测试","围城", "123456", "钱钟书", "出版者", "出版时间",10, 20, "标签", "描述", "存储信息", 10, "true", "在管", "借阅历史");
```


### 向数据库中插入**用户**信息
```sql
INSERT INTO user 
     (id,pitcture,name,nickName,jobID,phoneNumber,joinTime,state,authority)
     VALUES
     ("12345","头像","周","zhou","z5002223","13100001111","2019-3-6","normal","user");
```

### 向数据库中插入**图书馆**信息
```sql
INSERT INTO library 
     (id,name,owner,location,description)
     VALUES
     ("12345","abc图书馆","abc","广东省xx市","这是一个很好的图书馆");
```

## 查询数据
```sql
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M]
```