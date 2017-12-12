import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { abstractModuleType } from '../actions-base';
export class PurchaseOrderQueryModuleType extends abstractModuleType {
    static staticModuleKey = "PurchaseOrderQueryModule";
    static staticFactoryKey = "purOrderQuery";
    constructor(options: IModuleType = {
        factoryKey: PurchaseOrderQueryModuleType.staticFactoryKey,
        moduleKey: PurchaseOrderQueryModuleType.staticModuleKey
    }) {
        if (!options.moduleKey) {
            options.moduleKey = PurchaseOrderQueryModuleType.staticModuleKey;
        }
        if (!options.factoryKey) {
            options.factoryKey = PurchaseOrderQueryModuleType.staticFactoryKey;
        }
        super(options);
    }
}

import { ComponentTypeBase } from '../actions-base';

export class PurchaseOrderQueryType extends ComponentTypeBase {
}