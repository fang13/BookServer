# BookServer

## 目录
* [代码结构说明](#代码结构说明)
* [目录结构说明](#编译、调试及执行命令)

### 代码结构说明
`out`目录存放生成文件  
`src`目录存放代码  
`src\base`目录存放基础数据结构  
`client`目录实现客户端接口  
`manager`目录实现管理员接口  
`server`目录实现业务处理逻辑  
`util`目录存放公用类及方法

### 编译、调试及执行命令
* 编译命令为  
`npm run compile`
* 调试命令为  
在vscode里执行 `F5`
* 执行命令为  
`node out/app`