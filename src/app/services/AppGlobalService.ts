import { Injectable, EventEmitter, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IAction, ISubject } from '@framework-models/IAction';
import { UUID } from '@untils/uuid';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { NavTabModel } from '@framework-common/nav-tabs/NavTabModel';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { NavDesktopItem } from '@framework-models/nav-desktop-Item';
import { IModuleType } from '@framework-base/component/interface/IComponentFactoryType';
import { BreakPoint } from '@framework-services/mediaquery/breakpoints/break-point';
import { NavTabsComponent } from '@framework-common/nav-tabs/nav-tabs.component';
import { TaskQueueManager } from '@untils/taskQueue';
import { MediaMonitor } from '@framework-services/mediaquery/media-monitor';
import { PageViewerService } from '@framework-common/page-viewer/page-viewer.service';
import { FormService } from '@framework-components/form/FormService';
import { IModuleRef } from '@framework-models/imoduleref';
import { defaultIfEmpty } from 'rxjs/operators/defaultIfEmpty';

@Injectable()
export class AppGlobalService {
    private _store: Map<string, Subject<IAction>> = new Map<string, Subject<IAction>>();
    _appStore: Subject<IAction>;
    host: string = null;
    dispatch(action: IAction, hasState: boolean = false, useBehaviorSubject: boolean = false) {
        let state$ = null;
        if (hasState) {
            state$ = new BehaviorSubject<any>(null);
            action.data.sender = state$;
        }
        if (action.target) {
            this.select(action.target, true, useBehaviorSubject).subject.next(action);
        } else {
            this._appStore.next(action);
        }
        return state$;
    }
    select(subject: string, onlyOne: boolean = true, useBehaviorSubject: boolean = false): ISubject {
        let key: string = subject;
        if (!this._store.has(subject)) {
            this._store.set(subject, (useBehaviorSubject ? new BehaviorSubject<IAction>(null) : new Subject<IAction>()));
        } else if (!onlyOne) {
            let id = UUID.uuid(8, 16);
            key = subject + "-" + id;
        }
        return {
            key: key,
            subject: this._store.get(subject),
            unsubscribe: () => this.unsubscribe(subject)
        };
    }
    getSubject(action: IAction, callback: (action: IAction) => void) {
        let state$ = new BehaviorSubject<any>(null);
        action.data.sender = state$;
        return { state: state$, callback: () => callback(action) };
    }
    delete(key: string) {
        if (this._store.has(key)) {
            this._store.get(key) && this._store.get(key).unsubscribe();
            this._store.delete(key);
        }
    }
    unsubscribe(key: string) {
        if (this._store.has(key)) {
            this._store.get(key).unsubscribe();
        }
    }
    private getModuleDescriptor(key: string) {
        let m = this.select(key, true, true);
        return {
            moduleLoad$: m.subject.pipe<IAction, IModuleRef>(
                filter(action => action && action.data && action.data.state),
                map(action => action.data.state)),
            unsubscribe: m.unsubscribe
        };
    }

    async observeModule(moduleType: string | Type<IModuleType>, subscribe?: (moduleRef: IModuleRef) => void, runOnce: boolean = true) {
        let moduleLoad$ = typeof moduleType === 'string' ?
            this.getModuleObservable(moduleType) :
            this.getModuleObservable((new moduleType()).moduleKey);
        let defaultFn = () => { };
        if (!moduleLoad$) return defaultFn;
        if (subscribe && runOnce) {
            moduleLoad$.subscribe(subscribe).unsubscribe();
            return defaultFn;
        }
        else if (subscribe) {
            let subscription = moduleLoad$.subscribe(subscribe);
            return () => subscription.unsubscribe();
        }
        return defaultFn;
    }
    getModuleObservable(moduleType: string) {
        let moduleRef = this.getModuleDescriptor(moduleType);
        return moduleRef.moduleLoad$;
    }

    rightSubject$ = new BehaviorSubject<{ objectId: string; templateId: string }>(null);

    public blockUIEvent: EventEmitter<any>;

    constructor(public modalService: FormService,
        public pageViewerService: PageViewerService,
        protected mediaMonitor: MediaMonitor
    ) {
        this.blockUIEvent = new EventEmitter();
        this._appStore = new Subject<IAction>();
        this.mediaMonitor.observe()
            .pipe(filter(m => m.matches), distinctUntilChanged())
            .subscribe(m => {
                this.activeBreakPoints = this.mediaMonitor.activeBreakPoints;
            });
    }

    public startBlock() {
        this.blockUIEvent.emit(true);
    }
    public stopBlock() {
        this.blockUIEvent.emit(false);
    }
    public taskQueueManager: TaskQueueManager = new TaskQueueManager();
    public navTabManager: NavTabsComponent;
    public showType: ShowTypeEnum = ShowTypeEnum.tab;
    //活动breakPoints
    public activeBreakPoints: BreakPoint[] = [];

    OpenedRoutes: Map<string, string> = new Map<string, string>();

    componentFactories: Map<string, IModuleType> = new Map<string, IModuleType>();

    registerComponentFactoryRef(factoryComponentType: IModuleType) {
        if (!!!factoryComponentType || this.componentFactories.has(factoryComponentType.factoryKey)) return;
        this.componentFactories.set(factoryComponentType.factoryKey, factoryComponentType);
        this.observeModule(factoryComponentType.moduleKey, modRef => {
            modRef.componentFactoryContainerRef = factoryComponentType.componentFactoryRef;
        });
        return () => this.unRegisterComponentFactoryRef(factoryComponentType);
    }
    unRegisterComponentFactoryRef(factoryComponentType: IModuleType) {
        if (!!!factoryComponentType || !this.componentFactories.has(factoryComponentType.factoryKey)) return;
        this.componentFactories.delete(factoryComponentType.factoryKey);
    }

    async GetOrCreateComponentFactory(factoryKey: string | Type<IModuleType>): Promise<IComponentFactoryContainer> {
        let compFactoryType: IModuleType, refEntries, refValue;
        if (typeof factoryKey === 'string') {
            if (factoryKey && this.componentFactories.has(factoryKey))
                return this.componentFactories.get(factoryKey).componentFactoryRef;
        } else {
            refEntries = this.componentFactories.values();
            refValue = refEntries.next().value;
            while (refValue) {
                if (refValue instanceof factoryKey) {
                    return refValue.componentFactoryRef;
                }
                refValue = refEntries.next().value;
            }
            compFactoryType = new factoryKey();
        }
        return await this.createComponentFactory(compFactoryType ? compFactoryType.factoryKey : null);
    }

    commandLinks: NavDesktopItem[] = [
        { title: "计划采购订单", favicon: "assets/img/home.png", path: "/pc/news", subsystem: "news" },
        { key: 'pur3', title: "采购订单", favicon: "/assets/img/save.png", path: "purOrder", outlet: "pur5", subsystem: "news" },
        { key: 'saleKey', title: "销售订单", favicon: "/assets/img/setting.png", path: "saleOrderPath", outlet: "saleOrder", subsystem: "news" },
        { key: 'salesQuery12', title: "销售订单明细查询", favicon: "assets/img/home.png", path: "salesQuery1", outlet: 'salesQuery2', subsystem: "news" },
        { title: "外协订单", favicon: "assets/img/save.png", path: "/pc/d3", subsystem: "news" },
        { key: 'purOrderQuery', title: "采购订单明细查询", favicon: "assets/img/setting.png", path: "purOrderQuery", outlet: 'purOrderQuery', subsystem: "news" },
        { title: "计划外协订单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单物料查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产领料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "仓库调拨单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产入库单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "销售交货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产计划MPS", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "外协领料单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产报工单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产退料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "仓库盘点单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产返工单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "销售退货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "计划外生产计划单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "计划外需求分析单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "产品单层BOM维护", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "产品层次BOM", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
        { title: "生产补料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
        { title: "盘点盈亏单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "生产通知单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
        { title: "销售挂账单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
        { title: "应收款明细查询", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "产品资料", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
    ];
    private async createComponentFactory(factoryKey: string): Promise<IComponentFactoryContainer> {
        console.log(factoryKey);
        let navItem = this.commandLinks.find(item => item.outlet === factoryKey);
        if (!navItem) return null;
        if (navItem.key.length < 8) {
            navItem.key = UUID.uuid(10, 10).toString();
        }
        let navTabModel: NavTabModel = {
            key: navItem.key,
            name: navItem.key,
            title: navItem.title,
            favicon: navItem.favicon,
            outlet: navItem.outlet,
            active: false,
            showTabContent: this.showType === ShowTypeEnum.tab ? true : false,
            path: navItem.path,
            daemon: true
        };
        return await this.navTabManager.createNavTab(navTabModel);
    }
    public handleResolve(resolveData: any) {
        const resolve = resolveData || {};
        if (resolve.then) {
            resolve.then((data: any) => data);
        } else if (resolve.subscribe) {
            resolve.subscribe((data: any) => data);
        } else {
            return resolve || {};
        }
        return {};
    }

}
