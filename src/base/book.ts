/**
 * 存放书本的基本信息的类
 * @param id id号 @param levelOne 一级分类名 @param levelTwo 二级分类名
 * @param name 书名 @param ISBN ISBN号 @param author 作者
 * @param publisher 出版社 @param number 图书数量 @param borrowNum 收藏次数
 * @param label 标记 @param desc 图书介绍 @param storeInfo 图书馆分布情况
 *
 */
export class Book {
    private id: string;
    private levelOne: string;
    private levelTwo: string;
    private name: string;
    private ISBN: string;
    private author: string;
    private publisher: string;
    private publishDate: string;
    private number: number;
    private borrowNum: number;
    private label: string;
    private desc: number;
    private storeInfo: { [libraryID: string]: number };
    constructor(){
        
    }
}
