import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, AfterViewInit, Injector, ComponentRef, Type, Renderer } from '@angular/core';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { ComponentFactoryConatiner } from '@framework-base/component/ComponentFactoryConatiner';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { map } from 'rxjs/operators';
import { PurchaseOrderQueryModuleType, PurchaseOrderQueryType } from '@framework-actions/purchase-order-query-module/PurchaseOrderQueryType';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

@Component({
  selector: 'app-pur-query',
  templateUrl: './pur-query.component.html',
  styleUrls: ['./pur-query.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.flex-column-container-item]': 'true',
    '[class.el-hide]': '!visible',
    '[class.el-flex-show]': 'visible'
  }
})
export class PurchaseOrderQueryComponent extends ComponentFactoryConatiner
  implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  ngOnInit(): void {
    super.ngOnInit();
  }
  @Input() title: string = "采购订单查询";
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
          .registerComponentFactoryRef(new PurchaseOrderQueryModuleType(
            {
              factoryKey: this.pageModel.key,
              componentFactoryRef: this
            }));
      }).unsubscribe();
  }
  constructor(protected injector: Injector,renderer:Renderer) {
    super(injector, PurchaseOrderQueryModuleType.staticFactoryKey);
    this.initContainer();
  }

  createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
    return this.getComponentRef(PurchaseOrderListComponent, pageModel) as any;
  }
  createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
    return null;
  }
  createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
    throw new Error("Method not implemented.");
  }
  componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
    let compType = new componentType();
    switch (true) {
      case compType instanceof PurchaseOrderQueryType:
        return this.getComponentRef(PurchaseOrderListComponent, pageModel) as any;
      default:
        break;
    }
    return null;
  }

}
