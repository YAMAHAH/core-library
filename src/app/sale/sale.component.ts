import {
    Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy,
    ChangeDetectorRef, ComponentFactoryResolver, ViewChild, ComponentRef,
    Type, ViewContainerRef, ElementRef, EventEmitter, Input, Injector,
    AfterViewInit, ViewChildren, QueryList, forwardRef, Provider,
    Inject, Optional, HostListener
} from '@angular/core';

import {
    ActionsBase, AddAction, RemoveAction, SetCurrentAction,
    GetformModelArrayAction, CloseTaskGroupAction, abstractModuleType
} from '../actions/actions-base';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from '@framework-common/toasty/toasty.service';
import { PanelComponent } from '@framework-common/panel/panel.component';
import { PanelTestComponent } from './panel.test.component';

import { SaleOrderActions, AddSaleOrderAction, RemoveSaleOrderAction } from '../actions/sale/sale-order-actions';
import { ISubject, IAction } from '@framework-models/IAction';
import { PurOrderActions } from '../actions/pur/pur-order-actions';
import { ActivatedRoute, Router } from '@angular/router';
import { NavTreeViewComponent } from '@framework-components/nav-tree-view/nav-tree-view.component';
import { FormService } from '@framework-components/form/FormService';
import { FormOptions } from '@framework-components/form/FormOptions';
import { ToastPositionEnum } from '@framework-common/toasty/toastPositionEnum';
import { SelectItem, LazyLoadEvent } from '@framework-components/common/api';
import { CarService } from '@framework-services/car/carService';
import { Car } from '@framework-models/car/car';
import { ColumnBodyComponent } from './columnBody';
import { DateColumnBodyComponent } from './dateColumnBody';
import { CellEditorComponent } from './cellEditor';
import { styleUntils } from '@untils/style';
import { TaskQueueManager, TaskQueue } from '@untils/taskQueue';
import { PurOrderService } from '../pur/pur-order/purOrderService';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { providers } from '@framework-common/toasty/index';
import { tryGetValue } from '@untils/type-checker';
import { TemplateClassBase } from '@framework-models/template-class';
import { ReportManagerService } from '@framework-common/report-viewer/report-manager.service';
import { FlexItem, IFlexItem } from '@framework-models/flex-item';
import { Subscription } from 'rxjs/Subscription';
import { CoreDecorators as decorators } from '@untils/core-decorators';
import { TenantManageTemplate } from './TenantManageTemplate';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { PurDetailComponent } from '../pur/pur-order/pur.detail.component';
import { ComponentFactoryConatiner } from '@framework-base/component/ComponentFactoryConatiner';
import { reducer } from '@framework-base/IReducer';
import { DialogService } from '@framework-common/dialog';
import { ModalService } from '@framework-common/modal';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { ModalPosition } from '@framework-common/modal/modal.position.enum';
import { ModalTestComponent } from './modal.test.component';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { ActionItem } from '@framework-common/action-button/action-item.model';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { PageViewerOptions } from '@framework-common/page-viewer/page-viewer.options';
import { provideParent } from '@untils/di-helper';
import { Observable } from 'rxjs/Observable';
import { SaleModuleType } from '@framework-actions/sales-order-module/SalesModuleType';
import { PurchaseEditComponentType, PurchaseListComponentType } from '@framework-actions/purchase-order-module/PurchaseComponentType';
import { PurchaseModuleType } from '@framework-actions/purchase-order-module/PurchaseModuleType';

@Component({
    moduleId: module.id,
    selector: 'x-sale',
    exportAs: 'x-sale',
    templateUrl: 'sale.component.html',
    styleUrls: ['sale.component.css'],
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible',
        '[class.el-flex-show]': 'visible'
    },
    providers: [provideParent(SaleComponent, ComponentFactoryConatiner)],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleComponent extends ComponentFactoryConatiner
    implements reducer, OnInit, OnDestroy, AfterViewInit {

    @ViewChildren(KeyBindingDirective) keyBindings: QueryList<KeyBindingDirective>;
    ngAfterViewInit(): void {
        this.keyBindings.forEach(binding => {
            binding.elementTemplateId = "39423742047204234234";
        });
        this.globalService.rightSubject$.next({ objectId: "div9sdfddf596", templateId: "" });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.resizeEventSubscription.unsubscribe();
    }

    subject: ISubject;
    subjectActions: any;

    options = {
        buttons: [{
            //    action: () => this.modalService.closeAll()
        }]
    };
    testLg = new FlexItem({ span: 6, order: 3 });
    testXL = new FlexItem({ span: 8 });
    testLg2: FlexItem = FlexItem.create({ span: 3 });
    testLg3 = { span: 9 };
    constructor(
        protected injector: Injector,
        private dialogService: DialogService,
        private modalService: ModalService,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        public viewContainerRef: ViewContainerRef,
        private dialogModalService: FormService,
        private activeRoute: ActivatedRoute,
        private reportMan: ReportManagerService,
        private carService: CarService,
        private router: Router,
        @Inject(forwardRef(() => TenantManageTemplate)) @Optional() public td: TenantManageTemplate

    ) { //
        super(injector, SaleModuleType.staticFactoryKey);
        // @Optional() @Inject(forwardRef(() => TenantManageTemplate)) public td: TenantManageTemplate
        // console.log(injector.get(TenantManageTemplate));

        // setTimeout(() => {
        //     if (this.testLg && this.testLg.span) {
        //         this.testLg.span = 8;
        //         this.testLg.order = 4;
        //         this.testLg.style = 'font-size:14px;color:red;';
        //         this.testXL.span = 9;
        //         this.testLg2.span = 5;
        //         this.testLg3.span = 3;
        //         this.changeDetectorRef.markForCheck();
        //         this.decoratorTimeout();
        //     }

        // }, 6000);
        // setTimeout(() => {
        //     if (this.testLg && this.testLg.span) {
        //         this.testLg = FlexItem.create({ span: 15, order: 1 });
        //         this.testXL = FlexItem.create({ span: 10 });
        //         this.testLg2 = FlexItem.create({ span: 11 });
        //         this.testLg3 = { span: 10 };
        //         this.changeDetectorRef.markForCheck();
        //     }
        // }, 10000);
        // setTimeout(() => {
        //     if (this.testLg && this.testLg.span) {
        //         this.testLg.span = 6;
        //         this.testLg.order = -1;
        //         this.testLg.style = 'font-size:18px;color:white;';
        //         this.testXL.span = 13;
        //         this.testLg2.span = 6;
        //         this.testLg3.span = 8;
        //         this.changeDetectorRef.markForCheck();
        //     }
        // }, 15000);
        // setTimeout(() => {
        //     if (this.testLg && this.testLg.span) {
        //         this.testLg3.span = 6;
        //         this.changeDetectorRef.markForCheck();
        //     }
        // }, 25000);
        this.cars = [];
        this.cars.push({ label: 'Audi', value: 'Audi' });
        this.cars.push({ label: 'BMW', value: 'BMW' });
        this.cars.push({ label: 'Fiat', value: 'Fiat' });
        this.cars.push({ label: 'Ford', value: 'Ford' });
        this.cars.push({ label: 'Honda', value: 'Honda' });
        this.cars.push({ label: 'Jaguar', value: 'Jaguar' });
        this.cars.push({ label: 'Mercedes', value: 'Mercedes' });
        this.cars.push({ label: 'Renault', value: 'Renault' });
        this.cars.push({ label: 'VW', value: 'VW' });
        this.cars.push({ label: 'Volvo', value: 'Volvo' });

        this.reducer();
        this.pageModel = {
            showType: this.globalService.showType || ShowTypeEnum.showForm,
            title: "SaleOrder Group",
            active: true,
            componentFactoryRef: this,
            childs: [],
            formType: PageTypeEnum.container
        };
        console.log(this.pageModel);
        // this.registerFactory(new SaleComponentFactoryType(this.pageModel.key, this));
        this.activeRouter.queryParams
            .pipe(map(params => params['taskId']))
            .subscribe(param => {
                if (this.pageModel) {
                    this.pageModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.globalService
                    .registerComponentFactoryRef(new SaleModuleType(
                        { factoryKey: this.pageModel.key, componentFactoryRef: this }));
            }).unsubscribe();
    }

    // @decorators.setTimeout(30000, res => console.log('测试装饰器,是否可以定时执行这个方法呢'))
    decoratorTimeout() {
        if (this.testLg && this.testLg.span) {
            this.testLg3.span = 10;
            this.changeDetectorRef.markForCheck();
        }
    }
    saleOrderActions = new SaleOrderActions();
    salOrderSubject: ISubject;

    @Input() title: string = "销售订单";
    @Input() groupTitle: string = "销售订单分组";

    // createGroupList(extras?: any): IFormModel {
    //     return this.formModel;
    // }


    reducer() {
        this.salOrderSubject = this.globalService.select(this.saleOrderActions.key);
        this.salOrderSubject.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddSaleOrderAction:
                    //  this.addFormList(act.data.state);
                    break;
                case act instanceof RemoveSaleOrderAction:
                    //  this.removePurList(act.data.state);
                    break;
                case act instanceof AddAction:
                    // this.addNewPurList(act.data.state);
                    break;
                case act instanceof RemoveAction:
                    //  this.deleteCurrent();
                    break;
                case act instanceof SetCurrentAction:
                    // this.setCurrent(act.data.state);
                    break;
                case act instanceof GetformModelArrayAction:
                    if (act.data.sender) {
                        // act.data.sender.next(this.purLists);
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


    alert() {
        this.dialogService.alert({
            title: '销售订单',
            content: '数据<strong>保存</strong>成功.',
            yes: '确定',
            html: true,
            cssClass: 'x-alert', backdrop: false
        }).subscribe(
            data => console.log('Rebirth alert get yes result:', data),
            error => console.error('Rebirth alert get no result:', error)
            );
    }

    confirm() {
        this.dialogService.confirm({
            title: '确认',
            content: '确认要<strong>删除</strong>该单据！',
            yes: '确定',
            no: '取消',
            html: true,
            cssClass: "x-confirm",
            modalPosition: ModalPosition.bottomCenter,
            backdrop: false,
            modal: true

        }).subscribe(
            data => console.log('Rebirth confirm get yes result:', data),
            error => console.error('Rebirth confirm get no result:', error)
            );
    }

    prompt() {
        this.dialogService.prompt({
            title: '输入框',
            content: '请输入文本:',
            resolve: { text: 0 },
            yes: '确定',
            no: '取消',
            html: true,
            cssClass: "x-prompt",
            modalPosition: ModalPosition.center,
            backdrop: false,
            modal: true
        }).subscribe(
            data => console.log('确认返回结果:', data),
            error => console.error('取消返回结果:', error)
            );
    }


    componentOutlet: any = PanelTestComponent;
    selectResult(event: any) {
        console.log(event);
    }
    swap: boolean = false;
    addToast() {
        // Just add default Toast with title only
        // this.toastyService.default('Hi there');
        // Or create the instance of ToastOptions
        var toastOptions: ToastOptions = {
            title: "",
            msg: "销售订单正在处理中，请稍候......",
            showClose: false,
            timeout: 3000,
            theme: 'default',
            position: ToastPositionEnum.topRight,
            posCss: 'top:185px;right:12px;',
            manual: false,
            // componentOutlet: PanelTestComponent,
            onAdd: (toast: ToastData) => {
                // console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: (toast: ToastData) => {
                // console.log('Toast ' + toast.id + ' has been removed!');
                this.changeDetectorRef.markForCheck();
            }
        };
        // Add see all possible types in one shot
        // this.toastyService.info(toastOptions);

        if (!this.swap) {
            let toast = this.toastyService.wait(toastOptions);
        } else {
            this.toastyService.success(toastOptions);
        }
        this.swap = !this.swap;
        // this.toastyService.error(toastOptions);
        // this.toastyService.warning(toastOptions);

        // setTimeout(() => { if (toastOptions.manual) toast.onClose(); }, 500000);
    }
    openModal() {
        this.modalService.showModal<string>({
            component: ModalTestComponent,
            componentFactoryResolver: this.componentFactoryResolver,
            resolve: {
                text: 'I am from resolve data!'
            },
            modal: true,
            backdrop: false,
            minWidth: 800,
            minHeight: 600
        })
            .subscribe(data => {
                // console.log('Rebirth Modal -> Get ok with result:', data);
            }, error => {
                // console.error('Rebirth Modal -> Get cancel with result:', error);
            });
    }

    @ViewChild('xpanel', { read: PanelComponent }) xxPanel: PanelComponent;
    @ViewChild('appendToModal') appendToModal: ElementRef;
    @ViewChild(HostViewContainerDirective) pageViewerLocation: HostViewContainerDirective;
    clickMe(panel: PanelComponent) {
        // console.log(this.xxPanel);
    }
    closeMe(panel: any) {
        // console.log(panel);
        return this.xxPanel ? this.xxPanel.closeMe : false;
    }
    closeMe1: boolean = false;
    // closePanel(event: Event) {
    //     this.toastyService.clearAll();
    //     this.closeMe1 = true;
    //     (event as any).closeMe = true;
    //     // this.changeDetectorRef.detectChanges();
    // }
    compOutlets: Type<any>[] = [PanelTestComponent];
    modalResulthandler(event: any) {
        console.log(event);
    }

    items = [
        { id: 1, title: 'Panel header 1', content: 'Panel header 1' },
        { id: 2, title: 'Panel header 2', content: 'Panel header 2' }
    ];
    appendItems() {
        const len = this.items.length + 1;
        this.items.push({ id: len, title: `Panel header ${len}`, content: `Panel header ${len}` });
    }

    removeLastItem() {
        const len = this.items.length;
        this.items.splice(len - 1, 1);
    };

    isActionOpen: boolean;
    disabledActionOpen = true;
    actions: ActionItem[] = [{ id: 1, text: 'Save' }, { id: 2, text: 'Refresh' }, { divider: true }, {
        id: 3,
        text: 'Remove'
    }];


    onActionClick(item: ActionItem) {
        console.log(`Action item ${item.id} clicked`, item);
    }
    group: IPageModel;
    async open() {
        let factoryRef = await this.globalService.GetOrCreateComponentFactory(PurchaseModuleType);
        if (factoryRef) {
            let listRef = factoryRef.createListComponent();

            this.group = factoryRef.createGroup({
                visibleInNavTree: false,
                godFather: this.pageModel.childs[0]
            });
            let detail = factoryRef.createDetail(this.group, {
                visibleInNavTree: false,
                showType: ShowTypeEnum.showForm,
                godFather: this.pageModel.childs[0]
            });
            let listInstance = listRef.instance; //factoryRef.getComponentRef(PurListComponent).instance;
            listInstance.pageModel.resolve = { data: '手工创建组件,传递参数,显示窗体' };
            listInstance.context = { data: 'Context:手工创建组件,传递参数,显示窗体' };
            //设置关联
            let parentModel = this.pageModel.childs[0];
            listInstance.setOtherParent(parentModel);
            listInstance.show().subscribe((res: any) => console.log(res));
        }
    }
    // @ViewChild('pageViewLocation', { read: ViewContainerRef }) pageViewLocation: ViewContainerRef
    editCompRef: ComponentRef<IComponentBase>;
    isPageViewer: boolean = false;
    toggle() {
        // let curPageModel = this.editCompRef.instance.pageModel;
        // if (curPageModel.modalRef.instance.visible === false) {
        //     curPageModel.modalRef.instance.visible = true;
        // } else {
        //     let options = new PageViewerOptions();
        //     options.rootContainer = this.pageViewerLocation.viewContainerRef;
        //     //强制追加处理isForceAppend
        //     options.isForceAppend = true;
        //     options.append = this.editCompRef.instance.elementRef;
        //     //弹窗隐藏
        //     curPageModel.modalRef.instance.visible = false;
        //     //以pageViewer显示
        //     this.appStore.taskManager.showPage(this.editCompRef.instance.pageModel, options).subscribe((res: any) => console.log(res));
        // }
        let pageModel = this.editCompRef.instance.pageModel;
        if (pageModel) {
            if (this.isPageViewer)
                this.switchToMainView(pageModel);
            else
                this.switchToPageViewer(pageModel);
            this.isPageViewer = !this.isPageViewer;
            this.changeDetectorRef.markForCheck();
        }

    }
    async close() {
        // let purModuleRef = this.globalService.getModuleRef('PurchaseOrderModule');

        // let purSub = purModuleRef.moduleLoad$.subscribe(action => {
        //     let moduleRef = action;  //tryGetValue<IModuleRef>(() => action.data.state).value;
        //     if (moduleRef) {

        //         let compRef = moduleRef.getComponentRef(this.viewContainerRef, PurDetailComponent);
        //         this.editCompRef = compRef;
        //         let options = new FormOptions();
        //         options.resolve = { data: '代码创建组件数据传递' };
        //         options.modal = false;
        //         if (compRef) {
        //             let compIns = compRef.instance;
        //             compIns.pageModel.title = compIns.title;
        //             let parentModel = this.pageModel.childs[0];
        //             compIns.setOtherParent(parentModel);
        //             compIns.show(options).subscribe((res: any) => console.log(res));
        //         }
        //     }
        // });
        let factoryRef = await this.globalService.GetOrCreateComponentFactory(PurchaseModuleType);
        this.globalService.observeModule(PurchaseModuleType.staticModuleKey, moduleRef => {
            if (moduleRef) {
                let pageModel = moduleRef.componentFactoryContainerRef && moduleRef.componentFactoryContainerRef.createDefaultPageModel();
                let compRef = moduleRef.createComponentRef(this.viewContainerRef, PurchaseEditComponentType, pageModel);
                this.editCompRef = compRef;
                let options = new FormOptions();
                options.resolve = { data: '代码创建组件数据传递' };
                options.modal = false;
                if (compRef) {
                    let compIns = compRef.instance;
                    compIns.pageModel.title = compIns.title;
                    let parentModel = this.pageModel.childs[0];
                    compIns.setOtherParent(parentModel);
                    compIns.show(options).subscribe((res: any) => console.log(res));
                }
            }
        });

        if (factoryRef) {
            let compRef = factoryRef.createComponentRef(PurchaseEditComponentType); //getComponentRef(PurDetailComponent);
            this.editCompRef = compRef;
            let options = new FormOptions();
            options.resolve = { data: '代码创建组件数据传递' };
            options.modal = false;
            if (compRef) {
                let compIns = compRef.instance;
                compIns.pageModel.title = compIns.title;
                let parentModel = this.pageModel.childs[0];
                compIns.setOtherParent(parentModel);
                compIns.show(options).subscribe((res: any) => console.log(res));
            }
        }

        let task: TaskQueue = new TaskQueue(() => {
            if (factoryRef) {
                let compRef = factoryRef.createComponentRef(PurchaseListComponentType);
                let options = new PageViewerOptions();
                options.resolve = { data: '代码创建组件数据传递' };
                options.rootContainer = this.pageViewerLocation.viewContainerRef;
                // options.appendTo = this.pageViewerLocation && this.pageViewerLocation.viewContainerRef.element || this.viewContainerRef.element;
                if (compRef) {
                    let compIns = compRef.instance;
                    compIns.pageModel.title = compIns.title;
                    let parentModel = this.pageModel.childs[0];
                    compIns.setOtherParent(parentModel);
                    compIns.showPage(options).subscribe((res: any) => console.log(res));
                    setTimeout(() => {
                        this.setCurrent(compIns.pageModel);
                        this.changeDetectorRef.markForCheck();
                    }, 10);
                }
            }
        });
        this.globalService.taskQueueManager.pushTask(task);
        let task2: TaskQueue = new TaskQueue(
            () => {
                setTimeout(() => this.fireKeyEvent(window, "keydown", 13), 10);
                // let event: KeyboardEvent = { keyCode: 112, ctrlKey: true, shiftKey: true };
                //        $('#print').bind('click',function(){
                //         console.log("start")
                //         e = jQuery.Event("keydown");
                //         e.keyCode= 112; //enter key
                //         e.ctrlKey=true;
                //         e.shiftKey=true;
                //         $(document).trigger(e);
                //         console.log("end")
                //     })

                window.onkeydown = (e) => {
                    console.log(e.keyCode)
                    console.log(e.ctrlKey)
                    console.log(e.shiftKey)
                };
            });

        this.globalService.taskQueueManager.pushTask(task2);

        let purOrdSrv = factoryRef.getService(PurOrderService);
        purOrdSrv && purOrdSrv.showMessage();
    }

    fireKeyEvent(el: any, evtType: any, keyCode: any) {
        let evtObj: any;
        if (document.createEvent) {
            if ((window as any).KeyEvent) {//firefox 浏览器下模拟事件
                evtObj = document.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
            } else {//chrome 浏览器下模拟事件
                evtObj = document.createEvent('UIEvents');
                (evtObj as UIEvent).initUIEvent(evtType, true, true, window, 1);

                delete evtObj.keyCode;
                if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                    Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                } else {
                    evtObj.key = String.fromCharCode(keyCode);
                }

                if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                    Object.defineProperty(evtObj, "ctrlKey", { value: false });
                } else {
                    evtObj.ctrlKey = false;
                }
            }
            el.dispatchEvent(evtObj);

        } else if ((document as any).createEventObject) {//IE 浏览器下模拟事件
            evtObj = (document as any).createEventObject();
            evtObj.keyCode = keyCode
            el.fireEvent('on' + evtType, evtObj);
        }
    }

    @ViewChild("printHtml") printHtml: ElementRef;
    invokeReportViewer() {
        let someJSONdata = [
            {
                name: 'John Doe',
                email: 'john@doe.com',
                phone: '111-111-1111'
            },
            {
                name: 'Barry Allen',
                email: 'barry@flash.com',
                phone: '222-222-2222'
            },
            {
                name: 'Cool Dude',
                email: 'cool@dude.com',
                phone: '333-333-3333'
            }
        ];
        //json
        // this.reportMan.preview(
        //     {
        //         printable: someJSONdata,
        //         properties: ['name', 'email', 'phone'],
        //         type: 'json'
        //     });
        // this.reportMan.preview({
        //     printable: "/testjson.json", //api/users/GetTestJSON
        //     properties: ['name', 'email', 'phone'],
        //     type: 'json'
        // });
        //pdf
        //this.reportMan.preview("http://localhost:9500/home/pdf?report=0");
        // this.reportMan.preview("/MaterialPreparation.pdf");
        //image
        //this.reportMan.preview({ printable: '/wm.jpg', type: 'image' });
        //this.reportMan.preview({ printable: 'api/Users/GetTestImage2', type: 'image', contentType: "image/jpeg" });
        //html
        this.reportMan.preview({
            elementRef: this.printHtml.nativeElement,
            honorMarginPadding: true,
            honorColor: true,
            type: 'html',
            htmlOptions: { elementRef: this.printHtml.nativeElement }
        });
    }

    getClass(pageModel: IPageModel) { //PurList
        if (!pageModel) return {};
        return {
            "el-hide": !pageModel.active,
            "el-flex-show": pageModel.active
        };
    }
    display: boolean;
    showDialog() {
        this.display = !this.display;
        let options: FormOptions = new FormOptions();
        options.componentOutlets = this.compOutlets;
        options.checkCloseBeforeFn = this.closeBeforeCheckFn;
        options.responsive = true;
        options.width = 500;
        options.header = "SaleOrder";
        options.modal = false;
        options.visible = true;
        options.resolve = { target: '1358', playload: 'transmport context data' }
        // options.append = this.appendToModal.nativeElement;
        options.rootContainer = this.viewContainerRef;
        options.injector = this.viewContainerRef.parentInjector;
        this.dialogModalService
            .showForm(options)
            .subscribe(result => {
                console.log(result);
            });
    }

    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            let subscription = this.dialogService.confirmAsync({
                title: '确认',
                content: '充许关闭当前窗体吗？',
                yes: '是',
                no: '否',
                html: true,
                modalPosition: ModalPosition.center,
                backdrop: false,
                modal: true
            }).subscribe(res => {
                if (res !== 3) {
                    event.cancel = false;
                }
                return resolve(() => { subscription.unsubscribe(); });
            });

        });

    }
    async beforeHide(event: any) {
        event.sender.checkCloseBeforeFn = async (event: any) => {
            return new Promise<any>(resolve => {
                if (true) {
                    this.dialogService.confirmAsync({
                        title: '确认',
                        content: '充许关闭当前窗体吗？',
                        yes: '是',
                        no: '否',
                        html: true,
                        modalPosition: ModalPosition.center,
                        backdrop: false,
                        modal: true
                    }).subscribe(res => {
                        if (res === 3) {
                            return resolve(event);
                        } else {
                            event.cancel = false;
                            return resolve(event);
                        }
                    });
                }
            });
        }
    }

    pageModel: IPageModel = { title: '销售订单', active: true, childs: [] };
    resizeEventSubscription: Subscription;
    ngOnInit() {
        this.resizeEventSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(100))
            .subscribe(e => {
                this.changeDetectorRef.markForCheck();
            });

        this.activeRouter.data
            .subscribe((data: any) => {
                console.log(data);
            });
        // this.setHostElementStyle();
        this.pageModel.closeAfterFn = this.closeAfterFn;
        this.pageModel.elementRef = this.viewContainerRef.element.nativeElement;
        this.pageModel.title = this.title;
        // this.formModel.instance = this;
        if (this.pageModel.showType === ShowTypeEnum.showForm) {
            this.globalService.navTabManager.show(this.pageModel);
        }
        if (this.pageModel.showType === ShowTypeEnum.showFormModal) {
            this.globalService.navTabManager.showModal(this.pageModel);
        }


        this.carService.getCarsMedium().then(cars => {

            this.datasource = cars;
            this.totalRecords = this.datasource.length;
            this.mycars = this.datasource.slice(0, 10);
            this.mycars.forEach(item => {
                item.saleDate = new Date().getTime();
            })
            this.changeDetectorRef.markForCheck();
        });
    }
    styleClearFn: any;
    setHostElementStyle() {
        let elStyle = ` 
        x-sale {
            display:flex;
            flex:1;
            flex-direction: column;
            width:100%
        }
        .el-hide {
            display:none;
        } 
        .el-flex-show { 
            display:flex;
        }
        `;
        this.styleClearFn = styleUntils.setElementStyle(this.elementRef.nativeElement, elStyle);
    }

    selectedCar: string = 'BMW';
    cars: SelectItem[];

    brand: any;
    brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

    filteredBrands: any[];

    filterBrands(event: any) {
        this.filteredBrands = [];
        for (let i = 0; i < this.brands.length; i++) {
            let brand = this.brands[i];
            if (brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredBrands.push(brand);
            }
        }
    }
    handleDropdownClick(event: any) {
        this.filteredBrands = [];
        //mimic remote call
        setTimeout(() => {
            this.filteredBrands = this.brands;
            this.changeDetectorRef.detectChanges();
        }, 100)
    }

    date3: Date;
    date6: Date;
    date7: Date;

    mycars: Car[];


    datasource: Car[];
    totalRecords: number;
    columnBody: Type<any> = ColumnBodyComponent;
    dateColumnBody: Type<any> = DateColumnBodyComponent;

    cellEditor: Type<any> = CellEditorComponent;

    cols: any[] = [
        { field: 'vin', header: 'Vin', cellComponent: null, cellEditor: null, editable: true, visible: true, required: false, enabled: true },
        { field: 'year', header: 'Year', cellComponent: DateColumnBodyComponent, cellEditor: null, editable: true, visible: true, required: false, enabled: true },
        { field: 'brand', header: 'Brand', cellComponent: null, cellEditor: this.cellEditor, editable: true, visible: true, required: false, enabled: true },
        { field: 'color', header: 'Color', cellComponent: this.columnBody, cellEditor: null, editable: true, visible: true, required: false, enabled: true }
    ];
    loadCarsLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
            if (this.datasource) {
                this.mycars = this.datasource.slice(event.first, (event.first + event.rows));
                this.mycars.forEach(item => {
                    item.saleDate = new Date().getTime();
                })
                this.changeDetectorRef.markForCheck();
            }
        }, 250);
    }

}
