/**
 * 存放图书馆的类
 * @param id id号 @param name 图书馆名称 @param owner 所属研究所
 * @param location 位置 @param description 描述
 */
export class Library{
    public id:string;
    public name:string;
    public owner:string;
    public location:string;
    public description:string;
    constructor(id:string,name:string,owner:string,location:string,description:string){
        this.id = id;
        this.name = name;  
        this.owner = owner;
        this.description = description;
        this.location = location;
    }
}