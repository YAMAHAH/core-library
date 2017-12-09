import { abstractModuleType } from '../actions-base';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
export class SaleModuleType extends abstractModuleType {
    static staticModuleKey = 'SaleOrderModule';
    constructor(options: IModuleType = {
        factoryKey: 'sale',
        moduleKey: SaleModuleType.staticModuleKey
    }) {
        super(options);
    }

}