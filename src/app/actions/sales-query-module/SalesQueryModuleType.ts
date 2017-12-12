import { abstractModuleType } from '../actions-base';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
export class SaleOrderQueryModuleType extends abstractModuleType {
    static staticModuleKey = 'SaleOrderQueryModule';
    static staticFactoryKey = 'saleQuery';

    constructor(options: IModuleType = {
        factoryKey: SaleOrderQueryModuleType.staticFactoryKey,
        moduleKey: SaleOrderQueryModuleType.staticModuleKey
    }) {
        if (!options.moduleKey) {
            options.moduleKey = SaleOrderQueryModuleType.staticModuleKey;
        }
        if (!options.factoryKey) {
            options.factoryKey = SaleOrderQueryModuleType.staticFactoryKey;
        }
        super(options);
    }
}