import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { abstractModuleType } from '../actions-base';
export class PurchaseOrderQueryModuleType extends abstractModuleType {
    static staticModuleKey = "PurchaseOrderQueryModule";
    constructor(options: IModuleType = {
        factoryKey: 'purOrderQuery',
        moduleKey: PurchaseOrderQueryModuleType.staticModuleKey
    }) {
        super(options);
    }
}

import { ComponentTypeBase } from '../actions-base';

export class PurchaseOrderQueryType extends ComponentTypeBase {
}