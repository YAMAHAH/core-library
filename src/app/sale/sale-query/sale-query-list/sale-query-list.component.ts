import { Component, OnInit, ViewEncapsulation, Input, Injector } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';

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
  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();

  }

}
