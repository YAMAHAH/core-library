import {
    Component, OnInit, Input, Injector, AfterContentInit,
    AfterViewInit
} from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { UUID } from '@untils/uuid';
import { styleUntils } from '@untils/style';


@Component({
    selector: 'gx-sale-detail',
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible && !!!pageModel?.modelRef',
        '[class.el-flex-show]': 'visible && !!pageModel?.modelRef'
    },
    templateUrl: './sale.detail.html'
})
export class SaleDetailComponent extends ComponentBase
    implements OnInit, AfterContentInit, AfterViewInit {

    ngAfterContentInit(): void {
    }
    ngAfterViewInit(): void {
    }
    closeBeforeCheckFn: Function;
    @Input() title: string = "采购订单";

    purOrder: any;
    constructor(protected injector: Injector) {
        super(injector);
    }
    ngOnInit() {
        this.purOrder = { pono: this.pageModel.key, ptnno: "JL-" + UUID.uuid(8, 10) };
    }
}