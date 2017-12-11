import { abstractModuleType } from '../actions-base';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
export class SaleQueryModuleType extends abstractModuleType {
    static staticModuleKey = 'SaleOrderQueryModule';
    constructor(options: IModuleType = {
        factoryKey: 'saleQuery',
        moduleKey: SaleQueryModuleType.staticModuleKey
    }) {
        super(options);
    }

}