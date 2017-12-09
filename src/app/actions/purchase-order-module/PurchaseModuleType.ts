import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { abstractModuleType } from '../actions-base';
export class PurchaseModuleType extends abstractModuleType {
    static staticModuleKey = "PurchaseOrderModule";
    constructor(options: IModuleType = {
        factoryKey: 'pur',
        moduleKey: PurchaseModuleType.staticModuleKey
    }) {
        super(options);
    }
}