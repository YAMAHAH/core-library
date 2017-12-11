// Angular Imports
import { NgModule, Injector } from '@angular/core';

// This Module's Components
import { CoreModule } from '@framework-common/shared/shared-module';
import { CommonModule } from '@angular/common';
import { NavTreeViewModule } from '@framework-components/nav-tree-view/nav-tree-view.module';
import { Routes, RouterModule } from '@angular/router';
import { AbstractModuleBase } from '@framework-base/module/AbstractModuleBase';
import { SaleQueryModuleType } from '@framework-actions/sales-query-module/SalesQueryModuleType';
import { PurchaseOrderQueryType, PurchaseOrderQueryModuleType } from '../../actions/purchase-order-query-module/PurchaseOrderQueryType';
import { PurchaseOrderQueryComponent } from './pur-order-query.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

export const purOrderQueryRouteConfig: Routes = [
    { path: "", component: PurchaseOrderQueryComponent, data: { title: '采购订单明细查询' } }
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(purOrderQueryRouteConfig),
        NavTreeViewModule
    ],
    declarations: [
        PurchaseOrderQueryComponent,
        PurchaseOrderListComponent
    ],
    exports: [

    ],
    entryComponents: [
        PurchaseOrderListComponent
    ]
})
export class PurchaseOrderQueryModule extends AbstractModuleBase {
    constructor(injector: Injector) {
        super(injector, PurchaseOrderQueryModuleType.staticModuleKey);
    }
}

/**
 * 1.配置TAB导航数据
 * 2.配置模块路由
 * 3.增加TAB页模块组件容器,继承ComponentFactoryConatiner抽象类
 * 4.增加模块列表组件(查询组件和列表组件同归为列表类型),继承ComponentBase抽象类
 * 5.配置模块,继承AbstractModuleBase,注册模块
 * 6.增加对外访问类,用于其它模块创建本模块组件
 */
