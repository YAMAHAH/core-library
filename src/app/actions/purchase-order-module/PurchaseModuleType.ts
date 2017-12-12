import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { abstractModuleType } from '../actions-base';
export class PurchaseModuleType extends abstractModuleType {
    static staticModuleKey = "PurchaseOrderModule";
    static staticFactoryKey = 'pur5';
    constructor(options: IModuleType = {
        factoryKey: PurchaseModuleType.staticFactoryKey,
        moduleKey: PurchaseModuleType.staticModuleKey
    }) {
        if (!options.moduleKey) {
            options.moduleKey = PurchaseModuleType.staticModuleKey;
        }
        if (!options.factoryKey) {
            options.factoryKey = PurchaseModuleType.staticFactoryKey;
        }
        super(options);
    }
}