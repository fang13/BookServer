/**
 * 存放书本的基本信息的类
 * @param id id号 @param levelOne 一级分类名 @param levelTwo 二级分类名
 * @param name 书名 @param ISBN ISBN号 @param author 作者
 * @param publisher 出版社 @param amount 图书数量 @param borrowedTimes 借阅次数
 * @param label 标记 @param desc 图书介绍 @param storeInfo 图书馆分布情况
 * @param isCanBeBorrowed 能否被借阅 @param state 图书 @param borrowHistory 借阅历史
 */
export class Book {
    public id: string;
    public levelOne: string;
    public levelTwo: string;
    public name: string;
    public ISBN: string;
    public author: string;
    public publisher: string;
    public publishDate: string;
    public amount: number;
    public borrowedTimes: number;
    public label: string;
    public desc: number;
    public storeInfo: { [libraryID: string]: number };
    public collectionTimes:number;
    public isCanBeBorrowed:boolean;
    public state:string;
    public borrowHistory:string;

    constructor(id:string,levelOne:string,levelTwo:string,name:string,ISBN:string,author:string,publisher:string,publishDate:string,
        amount:number,borrowedTImes:number,label:string,desc:number,collectionTimes:number,isCanbeBorrowed:boolean,state:string,borrowHistory:string ){
        this.id = id;
        this.levelOne = levelOne;
        this.levelTwo = levelTwo;
        this.name = name;
        this.ISBN = ISBN;
        this.author = author;
        this.publisher = publisher;
        this.publishDate = publishDate;
        this.amount = amount;
        this.borrowedTimes = borrowedTImes;
        this.label = label;
        this.desc = desc;
        this.collectionTimes = collectionTimes;
        this.isCanBeBorrowed = isCanbeBorrowed;
        this.state = state;
        this.borrowHistory = borrowHistory;
    }
}

/**
 * 存放借阅历史类
 * @param startBorrowTime 开始借阅时间 @param returnTime 归还时间  @param returnLibraryID 归还图书馆ID
 * @param borrower 借阅人 @param borrowerJobID 借阅人工号
 **/
export class BorrowHistory{

    public startBorrowTime:string;
    public returnTime:string;
    public returnLibraryID:string;
    public borrower:string;
    public borrowerJobID:string;
    constructor(startBorrowTime:string,returnTime:string,returnLibID:string,borrower:string,borrowerJobID:string){
        this.startBorrowTime = startBorrowTime;
        this.borrower = borrower;
        this.returnTime = returnTime;
        this.returnLibraryID = returnLibID;
        this.borrowerJobID = borrowerJobID;
    }
}
