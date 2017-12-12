// Angular Imports
import { NgModule, ComponentFactoryResolver, Injector, Type, ComponentRef, ViewContainerRef } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurOrderComponent } from './pur-order.component';
import { CoreModule } from '@framework-common/shared/shared-module';
import { NavTreeViewModule } from '@framework-components/nav-tree-view/nav-tree-view.module';
import { XYZDialogModule } from '@framework-common/dialog/dialog.module';
import { BadgeModule } from '@framework-common/badge/badge.module';
import { AlertBoxModule } from '@framework-common/alert-box/alert-box.module';
import { SideSilderMenuModule } from '@framework-components/side-silder-menu/side-silder-menu.module';
import { AccordionMenuModule } from '@framework-components/accordion-menu/accordion-menu.module';
import { PurDetailComponent } from './pur.detail.component';
import { PurListComponent } from './pur.list.component';
import { PurOrderService } from './purOrderService';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { DynamicFormModule } from '@framework-dynamic-forms/dynamic-form.module';
import { AbstractModuleBase } from '@framework-base/module/AbstractModuleBase';
import { PurchaseModuleType } from '@framework-actions/purchase-order-module/PurchaseModuleType';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { PurchaseOrderListType, PurchaseOrderEditType } from '@framework-actions/purchase-order-module/PurchaseComponentType';
import { MatIconModule, MatFormFieldModule } from '@angular/material';
import { ScrollModule } from '@framework-components/scroll/ScrollComponent';
import { ComponentPortal } from '@angular/cdk/portal';
import { COMPONENTMODALTOKEN } from '@framework-base/component/ComponentInjectorToken';



export const purRouteConfig: Routes = [
    { path: "", component: PurOrderComponent, data: { title: '采购模块' } }
];

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(purRouteConfig),
        XYZDialogModule,
        NavTreeViewModule,
        BadgeModule,
        AlertBoxModule,
        SideSilderMenuModule,
        AccordionMenuModule,
        DynamicFormModule,
        MatIconModule,
        MatFormFieldModule,
        ScrollModule
    ],
    declarations: [
        PurOrderComponent,
        PurDetailComponent,
        PurListComponent
    ],
    exports: [
        PurOrderComponent
    ],
    entryComponents: [PurDetailComponent, PurListComponent],
    providers: [PurOrderService]
})
export class PurOrderModule extends AbstractModuleBase {
    constructor(injector: Injector) {
        super(injector, PurchaseModuleType.staticModuleKey);
    }
    createListComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(viewContainer, PurListComponent, pageModel) as any;
    }
    createEditComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(viewContainer, PurDetailComponent, pageModel) as any;
    }
    createQueryComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    componentReducer<T extends IComponentBase>(viewContainer: ViewContainerRef, componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        let compType = new componentType();
        switch (true) {
            case compType instanceof PurchaseOrderListType:
                return this.getComponentRef(viewContainer, PurListComponent, pageModel) as any;
            case compType instanceof PurchaseOrderEditType:
                return this.getComponentRef(viewContainer, PurDetailComponent, pageModel) as any;
            default:
                break;
        }
        return null;
    }
    componentPortalReducer<T extends IComponentBase>(componentType: Type<IComponentType>,
        viewContainer: ViewContainerRef, pageModel?: IPageModel): ComponentPortal<T> {
        let compType = new componentType();
        let customTokens = new WeakMap<any, any>();
        customTokens.set(COMPONENTMODALTOKEN, pageModel);
        let injector = this.createCustomInjector(customTokens);
        switch (true) {
            case compType instanceof PurchaseOrderListType:
                return this.createComponentPortal(PurListComponent, viewContainer, injector) as any;
            case compType instanceof PurchaseOrderEditType:
                return this.createComponentPortal(PurDetailComponent, viewContainer, injector) as any;
            default:
                break;
        }
        return null;
    }
}


