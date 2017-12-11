import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { XYZUIModule } from '../common/rebirth-ui.module';
import { XYZDialogModule } from '../common/dialog/dialog.module';
import { NgModule, forwardRef, Injector, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef } from '@angular/core';
import { PopoverModule } from '@framework-common/popover/popover.module';
import { PanelModule } from '@framework-common/panel/panel.module';
import { AccordionModule } from '@framework-common/accordion/accordion.module';
import { AlertBoxModule } from '@framework-common/alert-box/alert-box.module';
import { AdModule } from '../ad/ad.module';
import { ToastyModule } from '@framework-common/toasty/index';
import { PanelTestComponent } from './panel.test.component';
import { ActionButtonModule } from '@framework-common/action-button/action-button.module';
import { ModalTestComponent } from './modal.test.component';
import { WebFormModule } from '@framework-components/form/FormModule';
import { OverlayPanelModule } from '@framework-components/overlaypanel/overlaypanel';
import { DropdownModule } from '../components/dropdown/dropdown';
import { DropdownformModule } from '@framework-components/dropdownform/dropDownForm.Module';
import { AutoCompleteModule } from '@framework-components/autocomplete/autocomplete';
import { CalendarModule } from '@framework-components/calendar/calendar';
import { DataTableModule } from '@framework-components/datatable/datatable';
import { ColumnBodyComponent } from './columnBody';
import { DateColumnBodyComponent } from './dateColumnBody';
import { CellEditorComponent } from './cellEditor';
import { CoreModule } from '../common/shared/shared-module';
import { ReportViewerModule } from '@framework-common/report-viewer/report.viewer.module';
import { TemplateClassBase } from '@framework-models/template-class';
import { getClassProviders } from '@untils/di-helper';
import { SaleOrderDataResolver } from './SaleOrderDataResolver';
import { TenantManageTemplate, TenantManageTemplate2 } from './TenantManageTemplate';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { AbstractModuleBase } from '@framework-base/module/AbstractModuleBase';
import { NavTreeViewModule } from '@framework-components/nav-tree-view/nav-tree-view.module';
import { SaleModuleType } from '@framework-actions/sales-order-module/SalesModuleType';
import { SaleListComponent } from './sale.list.component';
import { SaleDetailComponent } from './sale.detail.component';

export const saleRouteConfig: Routes = [
    {
        path: "", component: SaleComponent,
        data: {
            title: '销售模块',
            moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1"
        },
        resolve: {
            dataSource: SaleOrderDataResolver,
            resource: SaleOrderDataResolver
        }
    }
];

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(saleRouteConfig),
        XYZDialogModule,
        NavTreeViewModule,
        XYZUIModule,
        PopoverModule,
        PanelModule,
        AccordionModule,
        ActionButtonModule,
        AlertBoxModule,
        AdModule,
        ToastyModule,
        WebFormModule, OverlayPanelModule, DropdownModule, DropdownformModule,
        AutoCompleteModule, CalendarModule, DataTableModule, ReportViewerModule
    ],
    declarations: [
        SaleComponent,
        ColumnBodyComponent,
        DateColumnBodyComponent,
        CellEditorComponent,
        ModalTestComponent,
        PanelTestComponent,
        SaleListComponent,
        SaleDetailComponent
    ],
    exports: [
        SaleComponent,
        ColumnBodyComponent,
        DateColumnBodyComponent,
        CellEditorComponent
    ],
    entryComponents: [
        ModalTestComponent,
        PanelTestComponent,
        SaleComponent,
        ColumnBodyComponent,
        DateColumnBodyComponent,
        CellEditorComponent,
        SaleListComponent,
        SaleDetailComponent
    ],
    providers: [
        // ...getClassProviders([TenantManageTemplate, TenantManageTemplate2]),
        { provide: TenantManageTemplate, useClass: TenantManageTemplate },
        { provide: TenantManageTemplate2, useClass: TenantManageTemplate2 },
        { provide: SaleOrderDataResolver, useClass: SaleOrderDataResolver }
    ]
})
export class SaleModule extends AbstractModuleBase {
    constructor(injector: Injector) {
        super(injector, SaleModuleType.staticModuleKey);
    }
}


