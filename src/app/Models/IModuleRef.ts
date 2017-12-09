
import { ViewContainerRef, Type, ComponentRef, EventEmitter, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
export interface IModuleRef {
    /**
     * 获取模块组件工厂容器引用
     */
    componentFactoryContainerRef: IComponentFactoryContainer;
    /**
     * 获取模块组件引用
     */
    getComponentRef<TComp extends IComponentBase>(
        viewContainer: ViewContainerRef,
        componentType: Type<TComp>,
        formModel?: IPageModel): ComponentRef<TComp>;
    /**
     * 获取模块组件工厂
     */
    getComponentFactory<T extends IComponentBase>(componentType: Type<T>);
    /**
     * 获取模块服务
     */
    getService<T>(serviceType: Type<T> | InjectionToken<T>): T;
    /**
     * 创建组件引用
     */
    createComponentRef<T extends IComponentBase>(viewContainer: ViewContainerRef,
        componentType: Type<IComponentType>,
        pageModel?: IPageModel): ComponentRef<T>
    /**
     * 创建列表类型的组件
     */
    createListComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 创建编辑类型的组件
     */
    createEditComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 创建查询类型的组件
     */
    createQueryComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 创建容器类型的组件
     */
    createContainerComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T>;
}