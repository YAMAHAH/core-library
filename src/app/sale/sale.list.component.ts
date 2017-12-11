import { Component, OnInit, Input, ElementRef, EventEmitter, Injector, ViewContainerRef, ChangeDetectorRef } from '@angular/core';

import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { NavTreeNode } from '@framework-components/nav-tree-view/nav-tree-node';
import { UUID } from '@untils/uuid';
import { SaleDetailComponent } from './sale.detail.component';
import { SaleModuleType } from '@framework-actions/sales-order-module/SalesModuleType';

@Component({
    selector: 'gx-sale-list',
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible',
        '[class.el-flex-show]': 'visible',
    },
    templateUrl: './sale.list.html',
    styles: []
})
export class SaleListComponent extends ComponentBase implements OnInit {
    @Input() title: string = "采购订单清单";
    constructor(protected injector: Injector) {
        super(injector);
    }

    async onDblClick(item: any) {
        //create detail
        let detail: IPageModel;
        let idx = this.pageModel.parent.childs.findIndex(detail => detail.key === item.pono);
        if (idx > -1) {
            // get node
            detail = this.pageModel.parent.childs[idx];
            detail.modalRef && detail.modalRef.instance.moveOnTop();
        } else {
            //create node
            detail = {
                formType: PageTypeEnum.detail,
                showType: this.globalService.showType || ShowTypeEnum.showForm,
                key: item.pono,
                title: item.pono,
                active: false,
                tag: null,
                childs: [],
                componentFactoryRef: this.pageModel.componentFactoryRef,
                parent: this.pageModel.parent,
                resolve: this.globalService.handleResolve({ data: item })
            };
            this.pageModel.parent.childs.push(detail);
            let nd = new NavTreeNode(UUID.uuid(8, 10), item.pono, '/skdd', 'sndwd', 0);
            nd.tag = detail;
            detail.tag = nd;

            let node = this.pageModel.tag as NavTreeNode;
            if (node && node.parent) {
                node.parent.addNode(nd);
            }
            if (this.pageModel.componentRef) {
                let factoryRef = await this.globalService.GetOrCreateComponentFactory(SaleModuleType);
                if (factoryRef) {
                    detail.showType = ShowTypeEnum.showForm;
                    let ins = factoryRef.getComponentRef(SaleDetailComponent, detail).instance;
                    ins.context = detail.resolve;

                    ins.setOtherParent(this.pageModel.godFather);
                    ins.show().subscribe((res: any) => console.log(res));
                }
            }
        }

        this.pageModel.componentFactoryRef.setCurrent(detail);
    }


    purListData: any[] = [];
    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            return resolve(true);
        });

    }
    closeAfterFn: Function = () => {
    };


    ngOnInit() {
        super.ngOnInit();
        this.purListData = [
            { pono: "SO-16120001", title: "销售订单", active: false },
            { pono: "SO-16120002", title: "销售订单", active: false },
            { pono: "SO-16120003", title: "销售订单", active: false },
            { pono: "SO-16120004", title: "销售订单", active: false },
            { pono: "SO-16120005", title: "销售订单", active: false }
        ];

    }

}