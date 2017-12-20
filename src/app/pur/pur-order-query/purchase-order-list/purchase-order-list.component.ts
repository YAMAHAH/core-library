import { Component, OnInit, Input, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { PageStatusMonitor } from '@framework-services/application/PageStatusMonitor';

@Component({
  selector: 'gx-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.flex-column-container-item]': 'true',
    '[class.el-hide]': '!visible',
    '[class.el-flex-show]': 'visible'
  }
})
export class PurchaseOrderListComponent extends ComponentBase implements OnInit {
  @Input() title: string = "采购订单明细查询";
  constructor(protected injector: Injector, protected pageStatusMonitor: PageStatusMonitor) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pageStatusMonitor.idle(data => { console.log('application idle') });
    this.pageStatusMonitor.onEvery(3, () => { console.log('30s') });
    this.pageStatusMonitor.focus(() => { console.log('focus') });
    this.pageStatusMonitor.blur(() => { console.log('blur') });
    this.pageStatusMonitor.wakeup(() => { console.log('wakeup') });

  }

}
