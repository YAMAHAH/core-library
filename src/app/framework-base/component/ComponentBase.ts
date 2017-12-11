import {
    EventEmitter, OnInit, OnDestroy, Injector,
    ComponentFactoryResolver, ViewContainerRef,
    ElementRef, Input, ChangeDetectorRef, ReflectiveInjector
} from '@angular/core';
import { NavTreeNode } from '@framework-components/nav-tree-view/nav-tree-node';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { FormOptions } from '@framework-components/form/FormOptions';
import { PageViewerOptions } from '@framework-common/page-viewer/page-viewer.options';
import { ComponentFactoryConatiner } from './ComponentFactoryConatiner';
import { providers } from '../../common/toasty/index';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { UUID } from '@untils/uuid';

export abstract class ComponentBase implements OnInit, OnDestroy, IComponentBase {
    _visible: boolean = true;
    @Input() get visible(): boolean {
        return this._visible && this.pageModel && this.pageModel.active || this._visible && !!!this.pageModel;
    }

    set visible(val: boolean) {
        this._visible = val;
        if (val)
            this.elementRef.nativeElement.style.display = "flex";
        else
            this.elementRef.nativeElement.style.display = "none";
    }
    enable: boolean;
    getComponentFactoryType(): IModuleType {
        throw new Error("Method not implemented.");
    }
    @Input() title: string;
    @Input() pageModel: IPageModel;
    setOtherParent(godFather: IPageModel): IPageModel {
        if (godFather) {
            godFather.childs.push(this.pageModel);
            this.pageModel.godFather = godFather;
            if (this.pageModel.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = this.pageModel.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
            //创建依赖引用结点,添加到导航树中
            let dependNode = new NavTreeNode(this.pageModel.key, this.pageModel.title, '/', '', 0);
            dependNode.tag = this.pageModel;
            dependNode.isDependRef = true;

            this.pageModel.extras = dependNode;
            let parentNode = godFather.tag as NavTreeNode;
            if (parentNode) {
                parentNode.addNode(dependNode);
                godFather.componentFactoryRef.navTreeView.setCurrent(dependNode);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }
        return this.pageModel;
    }
    createBillModel(type: PageTypeEnum, key: string, title: string, billDataContext: any) {
        let billModel: IPageModel = {
            formType: type,
            key: key,
            title: title,
            active: false,
            tag: null,
            childs: [],
            componentFactoryRef: this.pageModel.componentFactoryRef,
            parent: this.pageModel.parent,
            showType: this.globalService.showType || ShowTypeEnum.showForm,
            resolve: this.globalService.handleResolve({ data: billDataContext }),
        };
        this.pageModel.parent.childs.push(billModel);

        let ndKey = UUID.uuid(8, 10);
        let nd = new NavTreeNode(ndKey, ndKey, '/path', 'param', 0);
        nd.tag = billModel;
        billModel.tag = nd;

        let node = this.pageModel.tag as NavTreeNode;
        if (node && node.parent) {
            node.parent.addNode(nd);
        }
        this.pageModel.componentFactoryRef.setCurrent(billModel);
    }
    show(modalOptions?: FormOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.mainViewContainerRef = this.pageModel.elementRef.parentNode;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.globalService.navTabManager.show(this.pageModel, modalOptions);
    }

    showModal(modalOptions?: FormOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.mainViewContainerRef = this.pageModel.elementRef.parentNode;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.globalService.navTabManager.showModal(this.pageModel, modalOptions);
    }

    showPage(pageViewerOptions?: PageViewerOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.mainViewContainerRef = this.pageModel.elementRef.parentNode;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.globalService.navTabManager.showPage(this.pageModel, pageViewerOptions);
    }
    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            return resolve(true);
        });
    }
    closeAfterFn: Function;
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;

    expandPageModel(root: IPageModel, callback: (comp: IPageModel) => void) {
        callback(root);
        root.childs && root.childs.forEach(c => {
            this.expandPageModel(c, callback);
        });
    }
    /**
     * 向下搜索对象,找到返回,否则返回Null
     * @param startComp 
     * @param predicate 
     */
    searchDown(startComp: IPageModel, predicate: (comp: IPageModel) => boolean): IPageModel {
        let result: IPageModel = null;
        result = predicate(startComp) ? startComp : null || startComp.childs.filter(predicate)[0];
        if (result) return result;
        startComp.childs.forEach(element => {
            element.childs.forEach(element => {
                result = this.searchDown(element, predicate);
                if (result) return result;
            });
        });
        return result;
    }

    ngOnInit() {
        if (this.pageModel) {
            this.pageModel.globalManager = this.globalService;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.mainViewContainerRef = this.pageModel.elementRef.parentNode;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
            if (this.pageModel.showType === ShowTypeEnum.showForm) {
                this.show(this.pageModel);
            }
            if (this.pageModel.showType === ShowTypeEnum.showFormModal) {
                this.showModal(this.pageModel);
            }
        }
    }

    ngOnDestroy() {

    }
    protected globalService: AppGlobalService;
    /**
     * 组件的host元素引用,必须在派生类注入才有效
     */
    public elementRef: ElementRef;
    /**
     * 组件的HOST视图引用,必须在派生类注入才有效
     */
    public viewContainerRef: ViewContainerRef;
    public componentFactoryResolver: ComponentFactoryResolver;
    public activeRouter: ActivatedRoute;
    public changeDetectorRef: ChangeDetectorRef;

    constructor(protected injector: Injector, providers: any[] = []) {
        if (providers && providers.length > 0) {
            let provides = ReflectiveInjector.resolve(providers);
            let newRejector = ReflectiveInjector.fromResolvedProviders(provides, injector);
            this.injector = newRejector;
        }
        this.globalService = this.injector.get(AppGlobalService);
        this.elementRef = this.injector.get(ElementRef);
        this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
        this.activeRouter = this.injector.get(ActivatedRoute);
        this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
    }
}

