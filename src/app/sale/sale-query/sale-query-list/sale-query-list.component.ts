import { Component, OnInit, ViewEncapsulation, Input, Injector, ViewContainerRef } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { PurchaseModuleType } from '@framework-actions/purchase-order-module/PurchaseModuleType';
import { PurchaseOrderEditType } from '@framework-actions/purchase-order-module/PurchaseComponentType';
import { FormOptions } from '@framework-components/form/FormOptions';
import { tryGetValue } from '@untils/type-checker';
import { getMonthDays, getDateRangeDays } from '../../../untils/dateHelper';

@Component({
  selector: 'gx-sale-query-list',
  templateUrl: './sale-query-list.component.html',
  styleUrls: ['./sale-query-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.flex-column-container-item]': 'true',
    '[class.el-hide]': '!visible',
    '[class.el-flex-show]': 'visible',
  },
})
export class SaleQueryListComponent extends ComponentBase implements OnInit {
  @Input() title: string = "销售订单明细查询";
  constructor(protected injector: Injector,
    public viewContainerRef: ViewContainerRef) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();

  }
  /**
   * 以下为业务逻辑部份
   */

  getMonthDays(event) {
    console.table(getDateRangeDays('2016-10-1', '2017-12-1'));
  }

  async openPurchaseOrder() {
    let factoryRef = await this.globalService.GetOrCreateComponentFactory(PurchaseModuleType);
    this.globalService.moduleReady(PurchaseModuleType.staticModuleKey, async moduleRef => {
      if (moduleRef) {
        let pageModel = tryGetValue(() => moduleRef.componentFactoryContainerRef.createDefaultPageModel()).value;
        let compRef = moduleRef.createComponentRef(this.viewContainerRef, PurchaseOrderEditType, pageModel);
        let options = new FormOptions();
        options.resolve = { data: '代码创建组件数据传递' };
        options.modal = false;
        options.height = 600;
        if (compRef) {
          let compIns = compRef.instance;
          compIns.pageModel.title = compIns.title;
          let parentModel = this.pageModel;
          compIns.setOtherParent(parentModel);
          compIns.show(options).subscribe((res: any) => console.log(res));
        }
      }
    });

    if (factoryRef) {
      let compRef = factoryRef.createComponentRef(PurchaseOrderEditType);
      let options = new FormOptions();
      options.resolve = { data: '代码创建组件数据传递' };
      options.modal = false;
      options.height = 500;
      options.fullscreenBox = false;
      options.enableFlex = true;
      if (compRef) {
        let compIns = compRef.instance;
        compIns.pageModel.title = compIns.title;
        let parentModel = this.pageModel;
        compIns.setOtherParent(parentModel);
        compIns.show(options).subscribe((res: any) => console.log(res));
      }
    }

  }

}
