import { IComponentFactoryContainer } from './IComponentFactoryContainer';
export interface IModuleType {
    factoryKey?: string;
    moduleKey?: string;
    routePath?: string;
    tabKey?: string;
    routeOutlet?: string;
    componentFactoryRef?: IComponentFactoryContainer;

    [index: string]: any;
}