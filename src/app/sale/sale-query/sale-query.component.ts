import { Component, OnInit, OnDestroy, AfterViewInit, Injector, ComponentRef, Type, Input } from '@angular/core';
import { ComponentFactoryConatiner } from '@framework-base/component/ComponentFactoryConatiner';
import { SaleOrderQueryModuleType } from '@framework-actions/sales-query-module/SalesQueryModuleType';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { map } from 'rxjs/operators';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { SalesOrderQueryType } from '@framework-actions/sales-query-module/SalesQueryType';
import { SaleQueryListComponent } from './sale-query-list/sale-query-list.component';

@Component({
    moduleId: module.id,
    selector: 'gx-sale-query',
    templateUrl: 'sale-query.component.html',
    styleUrls: ['sale-query.component.scss'],
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible',
        '[class.el-flex-show]': 'visible'
    }
})
export class SaleQueryComponent extends ComponentFactoryConatiner
    implements OnInit, OnDestroy, AfterViewInit {
    ngAfterViewInit(): void {

    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
    @Input() title: string = "销售订单查询";
    initContainer() {
        this.pageModel = {
            title: this.title,
            active: true,
            componentFactoryRef: this,
            showType: ShowTypeEnum.tab,
            childs: [],
            formType: PageTypeEnum.container
        };

        this.activeRouter.queryParams
            .pipe(map(params => params['taskId']))
            .subscribe(param => {
                if (this.pageModel) {
                    this.pageModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.globalService
                    .registerComponentFactoryRef(new SaleOrderQueryModuleType(
                        {
                            factoryKey: this.pageModel.key,
                            componentFactoryRef: this
                        }));
            }).unsubscribe();
    }
    constructor(protected injector: Injector) {
        super(injector, SaleOrderQueryModuleType.staticFactoryKey);
        this.initContainer();
    }

    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(SaleQueryComponent, pageModel) as any;
    }
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(SaleQueryComponent, pageModel) as any;
    }
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        let compType = new componentType();
        switch (true) {
            case compType instanceof SalesOrderQueryType:
                return this.getComponentRef(SaleQueryListComponent, pageModel) as any;
            default:
                break;
        }
        return null;
    }

}
