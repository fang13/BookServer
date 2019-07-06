/**
 * 存放用户的基本信息的类
 * @param id id号 @param pitcture 头像id号 @param name 昵称
 * @param jobNum 工号 @param phone 手机 @param joinTime 加入时间
 * @param state 账号状态 @param authority 权限
 */
export class User {
    private id: string;
    private pitcture: string;
    private name: string;
    private jobNum: string;
    private phone: string;
    private joinTime: string;
    private state: string;
    private authority: string;
    constructor(id: string, pitcture: string, name: string,jobNum:string,phone:string) {
        this.id = id;
        this.pitcture = pitcture;
        this.name = name;
        this.jobNum = jobNum;
        this.phone = phone;
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