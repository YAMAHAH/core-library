import { abstractModuleType } from '../actions-base';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
export class SaleOrderModuleType extends abstractModuleType {
    static staticModuleKey = 'SaleOrderModule';
    static staticFactoryKey = 'saleOrder';
    constructor(options: IModuleType = {
        factoryKey: SaleOrderModuleType.staticFactoryKey,
        moduleKey: SaleOrderModuleType.staticModuleKey
    }) {
        if (!options.moduleKey) {
            options.moduleKey = SaleOrderModuleType.staticModuleKey;
        }
        if (!options.factoryKey) {
            options.factoryKey = SaleOrderModuleType.staticFactoryKey;
        }
        super(options);
    }

}