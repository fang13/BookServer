/**
 * 存放用户的基本信息的类
 * @param id id号 @param pitcture 头像id号 @param name 姓名
 * @param nickName 昵称 @param jobNum 工号 @param phoneNumber 手机号码
 * @param joinTime 加入时间@param state 账号状态 @param authority 权限
 */
export class User {
    public id: string;
    public pitcture: string;
    public name: string;
    public nickName:string;
    public jobID: string;
    public phoneNumber: string;
    public joinTime: string;
    public state: string;
    public authority: string;
    constructor(id: string, pitcture: string, name: string,nickName:string,jobID:string,phoneNumber:string) {
        this.id = id;
        this.pitcture = pitcture;
        this.name = name;
        this.nickName = nickName;
        this.jobID = jobID;
        this.phoneNumber = phoneNumber;
        this.joinTime = new Date().toLocaleString();
        this.state = UserState[0];
        this.authority = Authority[1];
    }
}

export enum UserState {
    "enable", "disable"
}

export enum Authority {
    "admin", "normal"
}