import { OnInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef, Injector, AfterViewInit, ViewChild, InjectionToken, forwardRef } from '@angular/core';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { IComponentBase } from '@framework-base/component/interface/IComponentBase';
import { ComponentBase } from './ComponentBase';
import { IPageModel } from '@framework-base/component/interface/IFormModel';
import { IAction } from '@framework-models/IAction';
import { PageModelExtras } from '@framework-base/component/PageModelExtras';
import { NavTreeViewComponent } from '@framework-components/nav-tree-view/nav-tree-view.component';
import { PageTypeEnum } from '@framework-base/component/PageTypeEnum';
import { NavTreeNode } from '@framework-components/nav-tree-view/nav-tree-node';
import { UUID } from '@untils/uuid';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { FormStateEnum } from '@framework-components/form/FormStateEnum';
import { isFunction } from "util";
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { IComponentType } from '@framework-base/component/interface/IComponentType';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { PageViewerOptions } from '@framework-common/page-viewer/page-viewer.options';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tryGetValue } from '@untils/type-checker';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { from } from 'rxjs/observable/from';
import { flatMap, every, distinctUntilChanged, map } from 'rxjs/operators';
import { TemplateClassObject } from '@framework-models/template-class-object';
import { FormOptions } from '@framework-components/form/FormOptions';
import { ReflectiveInjector } from '@angular/core/src/di/reflective_injector';

export abstract class ComponentFactoryConatiner extends ComponentBase
    implements OnInit, OnDestroy, IComponentFactoryContainer {
    public viewContainerRef: ViewContainerRef;
    public componentFactoryResolver: ComponentFactoryResolver;
    containerSubject: BehaviorSubject<{ objectId: string; templateId: string }> = new BehaviorSubject<{ objectId: string; templateId: string }>(null);
    @ViewChild(HostViewContainerDirective) pageViewerLocation: HostViewContainerDirective;
    groupTitle: string;
    principalPageModels: IPageModel[] = [];
    dependentPageModels: IPageModel[] = [];
    templateObjectMap: Map<symbol, TemplateClassObject> = new Map<symbol, TemplateClassObject>();

    @ViewChild(NavTreeViewComponent) navTreeView: NavTreeViewComponent;
    createGroup(pageModelExtras?: PageModelExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let groupPageModel: IPageModel = {
            formType: PageTypeEnum.group,
            title: this.title + "分组-" + len.toString(10),
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.globalService.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.globalService.showType
        };
        this.pageModel.childs.push(groupPageModel);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), this.title + "分组-" + len.toString(10), '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.tag = groupPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            groupNode.showNode = false;
        else groupNode.showNode = true;

        groupPageModel.tag = groupNode;

        this.navTreeView.addNode(groupNode);
        if (pageModelExtras && !!pageModelExtras.godFather) {
            this.addDependentPageModel(groupPageModel);//新增加内容,运行不正常
        }
        this.addPrincipalPageModel(groupPageModel);

        this.setCurrent(groupPageModel);
        return groupPageModel;
    }
    protected addPrincipalPageModel(pageModel: IPageModel) {
        if (pageModel) {
            this.principalPageModels.push(pageModel);
        }
    }
    protected addDependentPageModel(pageModel: IPageModel) {
        if (pageModel) {
            this.dependentPageModels.push(pageModel);
        }
    }

    createList(groupPageModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let listPageModel: IPageModel = {
            formType: PageTypeEnum.list,
            title: this.title + "清单-" + len.toString(10),
            active: true,
            parent: groupPageModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.globalService.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.globalService.showType
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), this.title + "清单-" + len.toString(10), '/skdd', 'sndwd', 0);
        nd.tag = listPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            nd.showNode = false;
        else nd.showNode = true;
        listPageModel.tag = nd;

        groupPageModel.tag.addNode(nd);
        groupPageModel.childs.push(listPageModel);
        if (pageModelExtras && pageModelExtras.godFather) {
            this.setGodFather(listPageModel, pageModelExtras.godFather);
        }
        this.setCurrent(listPageModel);
        return listPageModel;
    }
    createDetail(groupPageModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel {
        let editPageModel: IPageModel = {
            formType: PageTypeEnum.detail,
            key: UUID.uuid(8, 10),
            title: UUID.uuid(8, 10),
            active: false,
            tag: null,
            componentFactoryRef: this,
            parent: groupPageModel,
            resolve: this.globalService.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.globalService.showType,
            childs: []
        };

        groupPageModel.childs.push(editPageModel);

        let ndKey = UUID.uuid(8, 10);
        let newNode = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
        newNode.tag = editPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            newNode.showNode = false;
        else newNode.showNode = true;
        editPageModel.tag = newNode;

        let parentNode = groupPageModel.tag as NavTreeNode;
        if (parentNode) {
            parentNode.addNode(newNode);
        }
        if (pageModelExtras && pageModelExtras.godFather) {
            this.setGodFather(editPageModel, pageModelExtras.godFather);
        }
        this.setCurrent(editPageModel);
        return editPageModel;
    }
    /**
     * 设置干爹
     * @param child 
     * @param godFather 
     */
    setGodFather(child: IPageModel, godFather: IPageModel): IPageModel {
        if (godFather) {
            godFather.childs.push(child);
            child.godFather = godFather;
            if (child.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = child.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
            //创建依赖引用结点,添加到导航树中
            let dependNode = new NavTreeNode(child.key, child.title, '/', '', 0);
            dependNode.tag = child;
            dependNode.isDependRef = true;

            child.extras = dependNode;
            let parentNode = godFather.tag as NavTreeNode;
            if (parentNode) {
                parentNode.addNode(dependNode);
                godFather.componentFactoryRef.navTreeView.setCurrent(dependNode);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }
        return child;
    }

    createGroupList(pageModelExtras?: PageModelExtras): IPageModel {
        let group = this.createGroup(pageModelExtras);
        return this.createList(group, pageModelExtras);
    }
    createGroupDetail(pageModelExtras?: PageModelExtras): IPageModel {
        let group = this.createGroup(pageModelExtras);
        return this.createDetail(group, pageModelExtras);
    }

    protected taskId: any;
    selectNextVisiblePage(pageModel: IPageModel): void {
        let pageNodes = this.navTreeView.toList().filter(nd => nd.isGroup == false && nd.level > -1 && nd.showNode);
        let pageNodeIdx = pageNodes.findIndex(nd => nd.tag == pageModel);
        let notExistInDepends = this.getDependentPageModels().notContains(pageModel); //findIndex(val => val == pageModel) < 0;
        let pageNodeFilterFn = (nd: NavTreeNode) =>
            (nd.tag && !nd.tag.modalRef) ||
            nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized;

        if (pageNodeIdx > -1 && pageNodes.length > 1) {
            let last = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn).pop();
            let first = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn).shift();
            let nextPage = last || first;
            if (nextPage && notExistInDepends) {
                this.setCurrent(nextPage.tag);
                return;
            }
        }
        if (pageModel && pageModel.godFather && pageModel.godFather.componentFactoryRef != this) {
            pageModel.godFather.componentFactoryRef.selectNextVisiblePage(pageModel);
        } else
            this.setCurrent(null);
    }
    /**
         * 干爹列表中移除干儿子
         * @param pageModel 
         */
    removePageModelFromGodFather(pageModel: IPageModel) {
        if (pageModel && pageModel.godFather) {
            pageModel.godFather.childs.remove(pageModel);
            let godFatherNode: NavTreeNode = pageModel.godFather.tag;
            godFatherNode && godFatherNode.childs.remove(pageModel.extras);
        }
    }
    /**
     * 移除儿子
     * 同时从干爹列表中移除
     * @param pageModel 
     */
    removePageModel(pageModel: IPageModel): void {
        if (!!!pageModel) return;
        let pageNodes = this.navTreeView.toList().filter((nd) => nd.isGroup == false);
        let curPageIdx = pageNodes.findIndex(nd => nd.tag == pageModel);
        let pageModelIdx;
        if (curPageIdx > -1) {
            //如果有干爹,也要从干爹的列表中删除
            this.selectNextVisiblePage(pageModel);
            this.removePageModelFromGodFather(pageModel);
            let curPageNode = pageNodes[curPageIdx];
            let curPageParent: IPageModel = curPageNode.tag.parent;
            if (curPageParent && curPageParent.formType != PageTypeEnum.container) { //有父结点且不是容器类型则从父结点中删除
                let deletedModel = curPageParent.childs.remove(curPageNode.tag);
                if (deletedModel && deletedModel.componentRef) {
                    deletedModel.componentRef.destroy();
                }
            } else { //没有父结点且父结点不是容器类型,直接删除
                this.principalPageModels.remove(curPageNode.tag);
                let deletedDependModel = this.dependentPageModels.remove(curPageNode.tag);
                if (deletedDependModel && deletedDependModel.componentRef) {
                    deletedDependModel.componentRef.destroy();
                }
            }
            if (curPageNode.parent && curPageNode.level > -1) { //tree //删除分组结点
                curPageNode.parent.childs.remove(curPageNode);
                if (curPageNode.parent && curPageNode.parent.isGroup && curPageNode.parent.childs.isEmpty()) {
                    if (curPageNode.parent.parent) {
                        curPageNode.parent.parent.childs.remove(curPageNode.parent);
                    } else {
                        curPageNode.parent = null;
                    }

                    this.principalPageModels.remove(curPageNode.parent.tag);
                    let deletedDependModel = this.dependentPageModels.remove(curPageNode.parent.tag);
                    if (deletedDependModel && deletedDependModel.componentRef) {
                        deletedDependModel.componentRef.destroy();
                    }

                    if (this.principalPageModels.isEmpty() &&
                        this.dependentPageModels.isEmpty() &&
                        !this.globalService.navTabManager.navTabInClosing(this.taskId)) {
                        this.globalService.navTabManager.closeNavTab(this.taskId);
                    }
                    if (this.principalPageModels.every(model => model.tag.showNode == false) &&
                        this.dependentPageModels.isNotEmpty()) {
                        this.globalService.navTabManager.hideNavTab(this.taskId);
                    }
                }
            }
        }
    }


    current: IPageModel;
    setCurrent(pageModel: IPageModel): void {
        //如果是组,直接返回
        if (pageModel && pageModel.formType == PageTypeEnum.group) return;
        if (!!!pageModel) {
            this.current = null;
            this.navTreeView && this.navTreeView.setCurrent(null);
            return;
        }
        //获取依赖实体列表
        let dependModels: IPageModel[] = this.getDependentPageModels();
        //不存在于实体列表中
        let notExistInDepends = dependModels.notContains(pageModel);
        if (notExistInDepends && this.current && !this.current.godFather && this.current.showType == ShowTypeEnum.tab) {
            this.current.active = false;
        } else if (notExistInDepends && this.current && this.current.pageViewerRef) {
            this.current.active = false;
            this.current.pageViewerRef.instance.visible = false;
        } else if (notExistInDepends && this.current && this.current.views && this.current.views.current) {
            if (this.current.views.pageViewerRef) {
                this.current.views.current.active = false;
                this.current.views.pageViewerRef.instance.visible = false;
            }
        }
        else if (this.current)
            this.current.active = true;

        pageModel.active = true;
        this.current = pageModel;
        //先考虑子视图,再考虑子视图
        if (this.current.views && this.current.views.current) {
            if (this.current.views.current === this.current.views.modelRef) {
                this.current.views.modelRef.instance.moveOnTop();
                this.current.views.modelRef.instance.visible = true;
                this.current.views.modelRef.instance.restore(null);
            }
            if (this.current.views.current === this.current.views.pageViewerRef) {
                this.current.views.pageViewerRef.instance.visible = true;
            }
        } else {
            if (this.current && this.current.modalRef) {
                this.current.modalRef.instance.moveOnTop();
                this.current.modalRef.instance.visible = true;
                this.current.modalRef.instance.restore(null);
            }
            if (this.current && this.current.pageViewerRef) {
                this.current.pageViewerRef.instance.visible = true;
            }
        }

        if (notExistInDepends && !!!pageModel.godFather) {
            this.navTreeView.setCurrent(pageModel.tag);
            this.changeDetectorRef.markForCheck();
        } else {
            let godFather = pageModel.godFather;
            if (godFather) {
                godFather.componentFactoryRef.navTreeView.setCurrent(pageModel.extras);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }
    }

    setCurrentTreeNode(formModel: IPageModel) {
        if (formModel) {
            if (!!!formModel.godFather && formModel.componentFactoryRef) {
                formModel.componentFactoryRef.navTreeView.setCurrent(formModel.tag);
                formModel.componentFactoryRef.changeDetectorRef.markForCheck();
            } else {
                let godFather = formModel.godFather;
                if (godFather && godFather.componentFactoryRef) {
                    godFather.componentFactoryRef.navTreeView.setCurrent(formModel.extras);
                    godFather.componentFactoryRef.changeDetectorRef.markForCheck();
                }
            }
        }
    }

    closeAllPages(action: IAction): void {
        let nodeLists = this.navTreeView
            .toList()
            .filter((nd) => nd.isGroup == false && nd.level > -1 && nd.showNode)
            .reverse() || [];

        let pageModels = nodeLists.map(c => <IPageModel>c.tag).concat(this.pageModel).filter(p => !!p);
        if (pageModels.length > 0) {
            from(pageModels)
                .pipe(flatMap(pageModel => {
                    if (pageModel && pageModel.modalRef && pageModel.modalRef.instance)
                        return fromPromise(pageModel.modalRef.instance.forceClose(null));
                    else if (pageModel && pageModel.pageViewerRef && pageModel.pageViewerRef.instance)
                        return fromPromise(pageModel.pageViewerRef.instance.forceClose(null));
                    else
                        return fromPromise(this.closePage(pageModel));
                }),
                every((val: boolean) => val === true),
                distinctUntilChanged())
                .subscribe((res: boolean) => {
                    this.responseResultHandler(action, res);
                });
        } else {
            this.responseResultHandler(action, true);
        }
    }
    responseResultHandler(action: IAction, resultValue: boolean) {
        let result = { processFinish: true, result: resultValue };
        if (this.dependentPageModels.isNotEmpty()) {
            result.result = false;
        }
        if (action.data.sender) action.data.sender.next(result);
    }

    async closePage(pageModel: IPageModel) {
        return new Promise<boolean>(async resolve => {
            let rootNode: NavTreeNode;
            if (pageModel && !!pageModel.extras)
                rootNode = pageModel.extras;
            else if (pageModel && !!pageModel.tag)
                rootNode = pageModel.tag;
            let childNodes: NavTreeNode[] = [];
            if (!!rootNode) {
                childNodes = rootNode.getChildNodes()
                    .filter((nd) => nd.isGroup == false && !!nd.tag && nd.level > -1 && nd.showNode)
                    .reverse() || [];
            }
            let pageModels = childNodes.map(c => <IPageModel>c.tag);
            if (!!pageModel) pageModels.push(pageModel);
            if (pageModels.isNotEmpty()) {
                from(pageModels)
                    .pipe(flatMap(page => {
                        if (tryGetValue(() => pageModel.modalRef.instance).hasValue)
                            return fromPromise(pageModel.modalRef.instance.forceClose(null));
                        else if (tryGetValue(() => pageModel.pageViewerRef.instance).hasValue) {
                            return fromPromise(pageModel.pageViewerRef.instance.forceClose(null));
                        }
                        else
                            return fromPromise(this.closePageHandler(page));
                    }), every(val => val === true))
                    .subscribe(res => resolve(res));
            } else {
                resolve(true);
            }
        });
    }

    async closePageHandler(pageModel: IPageModel) {
        return new Promise<boolean>(async resolve => {
            if (pageModel) {
                let event = { cancel: true, sender: pageModel };
                let destroyFn;
                if (pageModel.closeBeforeCheckFn && isFunction(pageModel.closeBeforeCheckFn)) {
                    destroyFn = await pageModel.closeBeforeCheckFn(event);
                }
                if (event.cancel) {
                    await this.closeChildViews(pageModel);
                    if (isFunction(pageModel.closeAfterFn)) pageModel.closeAfterFn();
                    pageModel.componentFactoryRef.removePageModel(pageModel);
                }
                if (isFunction(destroyFn)) destroyFn();
                resolve(event.cancel);
            }
        });
    }
    async closeChildViews(pageModel: IPageModel) {
        //获取所有的子视图,并且将其关闭
        // if (tryGetValue(() => pageModel.views.modelRef.instance).hasValue)
        //     pageModel.views.modelRef.instance.dispose();

        tryGetValue(() => pageModel.views.modelRef.instance, value => value.dispose());

        // if (tryGetValue(() => pageModel.views.pageViewerRef.instance).hasValue)
        //     pageModel.views.pageViewerRef.instance.dispose();
        tryGetValue(() => pageModel.views.pageViewerRef.instance, ins => ins.dispose());

    }

    switchToPageViewer(pageModel: IPageModel) {
        //tab->pageViewer
        //pageForm->pageViewer
        if (!!!pageModel) return;
        //隐藏pageForm 
        if (pageModel.views.modelRef) pageModel.views.modelRef.instance.restoreContentAndHideHandler();
        //隐藏pageForm
        if (pageModel.modalRef) pageModel.modalRef.instance.visible = false;
        //隐藏TAB
        if (pageModel && pageModel.views.pageViewerRef) {
            pageModel.views.current = pageModel.views.pageViewerRef;
            //追加内容并显示
            pageModel.views.pageViewerRef.instance.appendContentAndShowHandler();
        } else {
            //新增显示
            let options = new PageViewerOptions();
            options.rootContainer = this.pageViewerLocation.viewContainerRef;
            //强制追加处理isForceAppend
            options.isForceAppend = true;
            options.append = pageModel.elementRef;
            //以pageViewer显示
            this.globalService.navTabManager
                .showPage(pageModel, options)
                .subscribe((res: any) => console.log(res));
        }

        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.setCurrent(pageModel);
        }, 10);
    }
    switchToPageForm(pageModel: IPageModel) {
        //tab->pageForm
        //pageviewer->pageForm
        if (!!!pageModel) return;
        //隐藏pageViewer
        if (pageModel.views.pageViewerRef) pageModel.views.pageViewerRef.instance.restoreContentAndHideHandler();
        //隐藏pageViewer
        if (pageModel.pageViewerRef) pageModel.pageViewerRef.instance.visible = false;
        //隐藏TAB
        if (pageModel && pageModel.views.modelRef) {
            pageModel.views.current = pageModel.views.modelRef;
            pageModel.views.modelRef.instance.appendContentAndShowHandler();
        } else {
            //新增显示
            let options = new FormOptions();
            options.rootContainer = this.pageViewerLocation.viewContainerRef;
            //强制追加处理isForceAppend
            options.isForceAppend = true;
            options.append = pageModel.elementRef;

            //以pageViewer显示
            this.globalService.navTabManager
                .show(pageModel, options)
                .subscribe((res: any) => console.log(res));
        }
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.setCurrent(pageModel);
        }, 10);
    }

    switchToPageTab(pageModel: IPageModel) {
        //pageform->tab
        //pageviewer->tab
        this.switchToMainView(pageModel);
    }
    switchToMainView(pageModel: IPageModel) {
        if (!!!pageModel) return;
        if (pageModel) {
            let curAuxView = pageModel.views.current;
            if (curAuxView) {
                pageModel.views.current = null;
            }
            if (pageModel.views.modelRef)
                pageModel.views.modelRef.instance.restoreContentAndHideHandler();

            if (pageModel.views.pageViewerRef)
                pageModel.views.pageViewerRef.instance.restoreContentAndHideHandler();
            this.changeDetectorRef.detectChanges();
            this.setCurrent(pageModel);
        }
    }

    /**
     * 获取所有依赖页面模型
     */
    getDependentPageModels() {
        let dependModels: IPageModel[] = [];
        this.expandPageModel({ childs: this.dependentPageModels, title: "", active: false }, (p) => {
            if (p.formType != PageTypeEnum.group) dependModels.push(p);
        });
        return dependModels;
    }

    findPageModelRef() {
        let foundedModels: IPageModel[] = [];
        let dependModels: IPageModel[] = this.getDependentPageModels();

        this.expandPageModel(this.pageModel, (pageModel => {
            if (dependModels.indexOf(pageModel) < 0 &&
                pageModel.godFather != null &&
                (
                    (pageModel.modalRef && pageModel.modalRef.instance &&
                        pageModel.views && !pageModel.views.current &&
                        pageModel.modalRef.instance.modalWindowState != 1) ||
                    (pageModel.views && pageModel.views.current && pageModel.views.modelRef &&
                        (pageModel.views.current == pageModel.views.modelRef) &&
                        pageModel.views.modelRef.instance.modalWindowState != 1)
                ))
                foundedModels.push(pageModel);
        }));
        return foundedModels;
    }

    findAuxModelRef() {
        let foundedModels: IPageModel[] = [];
        let dependModels: IPageModel[] = this.getDependentPageModels();
        this.expandPageModel(this.pageModel, (pageModel => {
            if (dependModels.indexOf(pageModel) < 0 &&
                pageModel.godFather != null &&
                pageModel.views && pageModel.views.current && pageModel.views.modelRef &&
                (pageModel.views.current == pageModel.views.modelRef) &&
                pageModel.views.modelRef.instance.modalWindowState != 1)
                foundedModels.push(pageModel);
        }));
        return foundedModels;
    }
    hidePageModels() {
        //获取所有模式窗体
        let pageModels = this.findPageModelRef();
        pageModels.forEach(m => {
            m.modalRef.instance.visible = false;
        });
    }

    showPageModels() {
        let pageModels = this.findPageModelRef();
        pageModels.forEach(m => {
            m.modalRef.instance.visible = true;
        });
    }

    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createEditComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createComponentRef<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        return this.componentReducer(componentType, pageModel) as any;
    }
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }

    getService<T>(serviceType: Type<T> | InjectionToken<T>): T {
        return this.injector && this.injector.get(serviceType);
    }

    registerTemplateObjects(...tempObjects: TemplateClassObject[]) {
        tempObjects.forEach(tempObj => {
            this.templateObjectMap.set(Symbol.for(tempObj.objectId), tempObj);
        });
    }
    count: number = 0;
    getTemplateClassObject(objectId: string): TemplateClassObject {
        let objectIdKey = Symbol.for(objectId);
        if (this.templateObjectMap.has(objectIdKey))
            return this.templateObjectMap.get(objectIdKey);
        let tempObject = new TemplateClassObject(objectId);
        if (objectId.like("col3924234234244") && (this.count % 2 == 0)) {
            tempObject.editable = false;
        }
        this.count++;
        this.templateObjectMap.set(objectIdKey, tempObject);
        return tempObject;
    }

    getComponentRef<T extends IComponentBase>(componentType: Type<T>, formModel?: IPageModel): ComponentRef<T> {
        const rootContainer = this.viewContainerRef ||
            this.globalService.navTabManager.hostFactoryContainer.viewContainerRef;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        let events = new Map<string, string>();
        let props = new Map<string, string>();
        componentFactory.outputs.map(e => events.set(e.templateName, e.propName));
        componentFactory.inputs.map(e => props.set(e.templateName, e.propName));

        const injector: Injector = rootContainer.parentInjector;

        const componentRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        let componentInstance = componentRef.instance;

        if (formModel) {
            let compOptions = formModel.options;
            if (compOptions) {
                for (const key in compOptions) {
                    if (compOptions.hasOwnProperty(key)) {
                        const val = compOptions[key];
                        if (events.has(key)) {
                            let event = componentInstance[events.get(key)];
                            event && event.subscribe(val);
                        }
                        else if (props.has(key)) {
                            componentInstance[props.get(key)] = val;
                        }
                    }
                }
            }
        }

        let newFormModel = formModel ? formModel : this.createDefaultPageModel();
        componentInstance.pageModel = newFormModel;
        newFormModel.componentRef = componentRef;
        return componentRef;
    }
    public createDefaultPageModel(pageModelExtras?: PageModelExtras) {
        let len = this.principalPageModels.length + 1;
        let title = UUID.uuid(8, 10).toString();
        let groupPageModel: IPageModel = {
            formType: PageTypeEnum.group,
            title: title + '默认组',
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.globalService.handleResolve(pageModelExtras && pageModelExtras.resolve) || {},
            showType: pageModelExtras && pageModelExtras.showType || ShowTypeEnum.tab
        };
        this.pageModel.childs.push(groupPageModel);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), title + '默认组', '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.showNode = false;
        groupNode.tag = groupPageModel;
        groupPageModel.tag = groupNode;

        let pageList: IPageModel = {
            formType: PageTypeEnum.list,
            title: title,
            active: true,
            parent: groupPageModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.globalService.handleResolve(pageModelExtras && pageModelExtras.resolve) || {},
            showType: pageModelExtras && pageModelExtras.showType || ShowTypeEnum.tab
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), title, '/skdd', 'sndwd', 0);
        nd.tag = pageList;
        nd.showNode = false;
        pageList.tag = nd;

        groupNode.addNode(nd);
        groupPageModel.childs.push(pageList);
        this.navTreeView.addNode(groupNode);
        //添加依赖页面
        this.addDependentPageModel(groupPageModel);
        this.setCurrent(groupPageModel);
        return pageList;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.componentFactoryDestroyFn) this.componentFactoryDestroyFn();
        this.pageModel = null;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
    protected componentFactoryDestroyFn: () => void;
    constructor(protected injector: Injector, factoryKey: string = null, provides: any[] = []) {
        super(injector, provides);
        // this.componentFactoryDestroyFn = this.globalService
        //     .registerComponentFactoryRef((
        //         {
        //             factoryKey: factoryKey,
        //             componentFactoryRef: this
        //         }));
    }
    async registerFactory(componentFactoryType: IModuleType): Promise<void> {
        return new Promise<void>(resolve => {
            this.activeRouter.queryParams
                .pipe(map(params => params['taskId']))
                .subscribe(param => {
                    if (this.pageModel) {
                        this.pageModel.key = this.taskId = param;
                    }
                    this.componentFactoryDestroyFn = this.globalService.registerComponentFactoryRef(componentFactoryType);
                }).unsubscribe();
        });
    }

    /**
     * 导航树项目单击事件默认实现
     * @param navNode 
     */
    onItemClick(navNode: NavTreeNode) {
        this.setCurrent(navNode.tag);
    }
    /**
     * 
     * @param navNode 导航树关闭按钮单击事件默认实现
     */
    async onItemCloseClick(navNode: NavTreeNode) {
        let formModel: IPageModel = navNode.tag;
        //根据model关闭,关闭前检查,等待关闭前处理函数
        await this.closePage(formModel);
    }

    /**
     * 组件关闭后回调函数默认实现
     * 
     */
    closeAfterFn: Function = () => {
        // this.appStore.taskManager.closeTaskGroup(() => this.pageModel.key);
    };
    get modelGroups() {
        return this.principalPageModels;
    }
    editModels(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === PageTypeEnum.detail);
    }
    listModels(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === PageTypeEnum.list);
    }
    queryModels(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === PageTypeEnum.query);
    }

}

