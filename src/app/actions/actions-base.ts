import { ActionBase, IMessageData, IAction } from '@framework-models/IAction';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { IComponentType } from '@framework-base/component/interface/IComponentType';


export class ActionsBase {
    constructor(public key: string, public componentFactoryRef: IComponentFactoryContainer = null) {
    }
    addAction(data: IMessageData): IAction {
        return new AddAction(this.key, data);
    }
    removeAction(data: IMessageData): IAction {
        return new RemoveAction(this.key, data);
    }
    setCurrentAction(data: IMessageData): IAction {
        return new SetCurrentAction(this.key, data);
    }
    getformModelArrayAction(data: IMessageData): IAction {
        return new GetformModelArrayAction(this.key, data);
    }
    closeTaskGroupAction(data: IMessageData): IAction {
        return new CloseTaskGroupAction(this.key, data);
    }
    closeAllTaskGroupAction(data: IMessageData): IAction {
        return new CloseAllTaskGroupAction(this.key, data);
    }
    getTaskGroupModalAction(data: IMessageData): IAction {
        return new GetTaskGroupModalAction(this.key, data);
    }

}

export class AddAction extends ActionBase { }
export class RemoveAction extends ActionBase { }
export class GetformModelArrayAction extends ActionBase { }
export class CloseTaskGroupAction extends ActionBase { }
export class CloseAllTaskGroupAction extends ActionBase { }
export class GetTaskGroupModalAction extends ActionBase { }
export class SetCurrentAction extends ActionBase { }

export abstract class abstractModuleType implements IModuleType {
    factoryKey: string;
    moduleKey: string;
    routePath: string;
    tabKey: string;
    routeOutlet: string;
    componentFactoryRef: IComponentFactoryContainer;

    static staticFactoryKey: string;
    static staticModuleKey: string;
    static staticRoutePath: string;
    static staticTabKey: string;
    static staticRouteOutlet: string;

    constructor(options?: IModuleType) {
        if (options) Object.assign(this, options);
        if (this.factoryKey) abstractModuleType.staticFactoryKey = this.factoryKey;
        else this.factoryKey = abstractModuleType.staticFactoryKey;

        if (this.moduleKey) abstractModuleType.staticModuleKey = this.moduleKey;
        else this.moduleKey = abstractModuleType.staticModuleKey;

        if (this.routePath) abstractModuleType.staticRoutePath = this.routePath;
        else this.routePath = abstractModuleType.staticRoutePath;

        if (this.routeOutlet) abstractModuleType.staticRouteOutlet = this.routeOutlet;
        else this.routeOutlet = abstractModuleType.staticRouteOutlet;
        if (this.tabKey)
            abstractModuleType.staticTabKey = this.tabKey;
        else this.tabKey = abstractModuleType.staticTabKey;
    }
}
export abstract class ComponentTypeBase implements IComponentType {
}

// export class PurchaseModuleType extends abstractModuleType {
//     static staticModuleKey = "PurchaseOrderModule";
//     constructor(options: IModuleType = {
//         factoryKey: 'pur',
//         moduleKey: PurchaseModuleType.staticModuleKey
//     }) {
//         super(options);
//     }
// }

// export class PurchaseListComponentType extends ComponentTypeBase {
// }

// export class PurchaseEditComponentType extends ComponentTypeBase {
// }

// export class PurchaseQueryComponentType extends ComponentTypeBase {
// }
// export class SaleModuleType extends abstractModuleType {
//     static staticModuleKey = 'SaleOrderModule';
//     constructor(options: IModuleType = {
//         factoryKey: 'sale',
//         moduleKey: SaleModuleType.staticModuleKey
//     }) {
//         super(options);
//     }

// }

