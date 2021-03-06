import { Injector, ComponentFactoryResolver, ViewContainerRef, Type, InjectionToken, ComponentRef, TemplateRef } from '@angular/core';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IAction } from '@framework-models/IAction';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { ComponentPortal, TemplatePortal, ComponentType, PortalInjector } from '@angular/cdk/portal';


export abstract class AbstractModuleBase {
    protected compFactoryResolver: ComponentFactoryResolver;
    protected globalService: AppGlobalService;
    constructor(protected injector: Injector, moduleKey: string) {
        this.globalService = this.injector.get(AppGlobalService);
        this.compFactoryResolver = this.injector.get(ComponentFactoryResolver);
        this.registryModule({ target: moduleKey, data: { state: this } }, false, true);
    }
    componentFactoryContainerRef: IComponentFactoryContainer;
    getComponentRef<T extends IComponentBase>(viewContainer: ViewContainerRef,
        componentType: Type<T>,
        formModel?: IPageModel): ComponentRef<T> {
        const rootContainer = viewContainer;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.getComponentFactory(componentType);
        let events = new Map<string, string>();
        let props = new Map<string, string>();
        componentFactory.outputs.map(e => events.set(e.templateName, e.propName));
        componentFactory.inputs.map(e => props.set(e.templateName, e.propName));
        const injector: Injector = rootContainer.parentInjector;

        const componentRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        let compInstance = componentRef.instance;

        if (formModel) {
            let compOptions = formModel.options;
            if (compOptions) {
                for (const key in compOptions) {
                    if (compOptions.hasOwnProperty(key)) {
                        const val = compOptions[key];
                        if (events.has(key)) {
                            let event = compInstance[events.get(key)];
                            event && event.subscribe(val);
                        }
                        else if (props.has(key)) {
                            compInstance[props.get(key)] = val;
                        }
                    }
                }
            }
        }
        let newFormModel: IPageModel = formModel ? formModel : { title: '', active: true };
        compInstance.pageModel = newFormModel;
        newFormModel.componentRef = componentRef;
        return componentRef;
    }
    getComponentFactory<T extends IComponentBase>(componentType: Type<T>) {
        return this.compFactoryResolver.resolveComponentFactory(componentType);
    }
    getService<T>(serviceType: Type<T> | InjectionToken<T>): T {
        return this.injector && this.injector.get(serviceType);
    }
    createListComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createEditComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createQueryComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createComponentRef<T extends IComponentBase>(viewContainer: ViewContainerRef, componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        return this.componentReducer(viewContainer, componentType, pageModel) as any;
    }
    componentReducer<T extends IComponentBase>(viewContainer: ViewContainerRef, componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }

    getTemplatePortal<T>(template: TemplateRef<T>, viewContainerRef: ViewContainerRef, context: T) {
        return new TemplatePortal(template, viewContainerRef, context);
    }
    protected createComponentPortal<T>(component: ComponentType<T>, viewContainer: ViewContainerRef, injector: Injector) {
        return new ComponentPortal(component, viewContainer, injector);
    }
    protected createCustomInjector(customTokens: WeakMap<any, any>) {
        let injector = new PortalInjector(this.injector, customTokens);
        return injector;
    }
    getComponentPortal<T>(componentType: Type<IComponentType>,
        viewContainer: ViewContainerRef, pageModel?: IPageModel) {
        return this.componentPortalReducer(componentType, viewContainer, pageModel);
    }
    componentPortalReducer<T extends IComponentBase>(componentType: Type<IComponentType>,
        viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentPortal<T> {
        throw new Error("Method not implemented.");
    }
    protected registryModule(action: IAction, hasRetureValue: boolean = false, useBehaviorSubject: boolean = true) {
        this.globalService.dispatch(action, hasRetureValue, useBehaviorSubject);
    }

}