import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ComponentRef, EventEmitter, Type, ComponentFactoryResolver, Injector, ViewContainerRef, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { styleUntils } from '@untils/style';
import { ISubject, IAction } from '@framework-models/IAction';
import { PurOrderActions, AddPurOrderAction, RemovePurOrderAction } from '@framework-actions/pur/pur-order-actions';
import { AddAction, RemoveAction, SetCurrentAction, GetformModelArrayAction, CloseTaskGroupAction, abstractModuleType } from '../../actions/actions-base';
import { UUID } from '@untils/uuid';
import { ActivatedRoute } from '@angular/router';

import { FormOptions } from '@framework-components/form/FormOptions';
import { NavTreeViewComponent } from '@framework-components/nav-tree-view/nav-tree-view.component';
import { NavTreeNode } from '@framework-components/nav-tree-view/nav-tree-node';
import { FormStateEnum } from '@framework-components/form/FormStateEnum';

import { isFunction } from '@framework-common/toasty/toasty.utils';
import { PurListComponent } from './pur.list.component';
import { PurDetailComponent } from './pur.detail.component';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { map } from 'rxjs/operators';
import { ComponentFactoryConatiner } from '@framework-base/component/ComponentFactoryConatiner';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { PurchaseModuleType } from '@framework-actions/purchase-order-module/PurchaseModuleType';
import { PurchaseOrderListType, PurchaseOrderEditType } from '@framework-actions/purchase-order-module/PurchaseComponentType';

@Component({
    selector: 'x-pur-order',
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible',
        '[class.el-flex-show]': 'visible'
    },
    templateUrl: './pur-order.component.html',
    styleUrls: ['./pur-order.component.scss']
})
export class PurOrderComponent extends ComponentFactoryConatiner implements OnInit, OnDestroy {
    @Input() title: string = "采购订单";
    @Input() groupTitle: string = "采购订单分组";
    constructor(
        protected injector: Injector,
        public viewContainerRef: ViewContainerRef
    ) {
        super(injector, PurchaseModuleType.staticFactoryKey);
        this.pageModel = {
            title: '采购订单分组',
            active: true,
            componentFactoryRef: this,
            showType: ShowTypeEnum.tab,
            childs: [],
            formType: PageTypeEnum.container
        };
        // this.registerFactory(new PurComponentFactoryType(this.formModel.key, this));
        this.activeRouter.queryParams
            .pipe(map(params => params['taskId']))
            .subscribe(param => {
                if (this.pageModel) {
                    this.pageModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.globalService
                    .registerComponentFactoryRef(new PurchaseModuleType(
                        {
                            factoryKey: this.pageModel.key,
                            componentFactoryRef: this
                        }));
            }).unsubscribe();
        this.reducer();
    }
    get formGroups() {
        return this.principalPageModels;
    }
    getDetails(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === PageTypeEnum.detail);
    }
    getLists(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === PageTypeEnum.list);
    }


    ngOnInit() {
        super.ngOnInit();
        // this.setupElStyle();
        this.pageModel.closeAfterFn = this.closeAfterFn;
        this.pageModel.elementRef = this.elementRef.nativeElement;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.globalService.delete(this.purOrderActions.key);
    }

    setupElStyle() {
        let styleHtml = ` 
        x-pur-order {
            display: flex;
            flex: 1 0 auto;
        }`;
        styleUntils.setElementStyle(this.elementRef.nativeElement, styleHtml);
    }

    getClass(listModel: IPageModel) { //PurList
        if (!listModel) return {};
        return {
            "el-hide": !listModel.active,
            "el-flex-show": listModel.active
        };
    }

    getDetailClass(detail: IPageModel) { //PurDetail
        if (!detail) return;
        return {
            "el-hide": !detail.active,
            "el-flex-show": detail.active
        }
    }

    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(PurListComponent, pageModel) as any;
    }
    createEditComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(PurDetailComponent, pageModel) as any;
    }
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        let compType = new componentType();
        switch (true) {
            case compType instanceof PurchaseOrderListType:
                return this.getComponentRef(PurListComponent, pageModel) as any;
            case compType instanceof PurchaseOrderEditType:
                return this.getComponentRef(PurDetailComponent, pageModel) as any;
            default:
                break;
        }
        return null;
    }

    purOrder: ISubject;
    purOrderActions = new PurOrderActions();
    async reducer() {
        this.purOrder = this.globalService.select(this.pageModel.key);
        this.purOrder.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddPurOrderAction:
                    this.addPrincipalPageModel(act.data.state);
                    break;
                case act instanceof RemovePurOrderAction:
                    this.removePageModel(act.data.state);
                    break;
                case act instanceof AddAction:
                    this.createGroupList(act.data.state);
                    break;
                case act instanceof RemoveAction:
                    this.deleteCurrent();
                    break;
                case act instanceof SetCurrentAction:
                    this.setCurrent(act.data.state);
                    break;
                case act instanceof GetformModelArrayAction:
                    if (act.data.sender) {
                        act.data.sender.next(this.principalPageModels);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeAllPages(act);
                    break;
                default:
                    break;
            }
        });
    }

    deleteCurrent() {
        if (this.current) {
            this.removePageModel(this.current);
        }
    }

}

