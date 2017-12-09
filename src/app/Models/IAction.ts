import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export interface IAction {
    /**
     * 目标类型
     */
    target: string;
    actionType?: string;
    /**
     * ACTION数据
     */
    data?: IMessageData;
}

export interface IMessageData {
    /**
     * 发送者类型
     */
    sender?: string | Observable<any> | any;
    /**
     * 信息状态数据
     */
    state?: any;
}

export class ActionBase implements IAction {
    constructor(public target: string, public data: IMessageData) {
    }
}

export interface ISubject {
    key: string;
    subject: Subject<IAction>;
    unsubscribe: Function;
}