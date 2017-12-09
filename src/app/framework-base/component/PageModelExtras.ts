import { ShowTypeEnum } from './ShowTypeEnum';
import { Observable } from 'rxjs/Observable';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
export interface PageModelExtras {
    /**
     * 显示模式
     */
    showType?: ShowTypeEnum;
    /**
     * 解析数据
     */
    resolve?: Promise<any> | Observable<any> | any;
    /**
     * 导航树中是否可见
     */
    visibleInNavTree?: boolean;
    /**
     * 设置其它创建者
     */
    godFather?: IPageModel;
}
