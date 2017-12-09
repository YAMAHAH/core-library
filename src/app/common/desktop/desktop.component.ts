import { Component, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, Renderer2, Input, ViewContainerRef, NgZone } from '@angular/core';
import { NavDesktopItem } from '@framework-models/nav-desktop-Item';
import { Route, Router, ActivatedRoute, RouterPreloader } from '@angular/router';
import { styleUntils } from '@untils/style';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { UUID } from '@untils/uuid';
import { NavTabModel } from '../nav-tabs/NavTabModel';
import { MenuItem } from '@framework-components/common/api';
import { ContextMenu } from '@framework-components/contextmenu/contextmenu';
import { DesktopLayoutContainerComponent } from '../layout/desktop-layout-container/desktop-layout-container.component';
import { map, filter } from 'rxjs/operators';
import { pcRootRouterConfig } from '../pc-index/index.router';
import { SelectivePreloadingStrategy } from '@framework-services/SelectivePreloadingStrategy';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

import { tryGetValue } from '@untils/type-checker';
import { IModuleRef } from '@framework-models/imoduleref';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';

@Component({
    selector: 'x-desktop',
    templateUrl: 'desktop.component.html',
    styleUrls: ['desktop.component.css']
})
export class DesktopComponent implements OnInit, AfterViewInit {

    @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;
    @ViewChild('desktopItemContextMenu') _itemContextMenu: ContextMenu;
    @ViewChild('desktopContextMenu') _desktopContextMenu: ContextMenu;

    @ViewChild('gx-desktop-layout-container', { read: ElementRef }) _desktopLayoutContainerRef: ElementRef;

    get items() {
        return this.globalService.commandLinks;
    }
    subSystem: string = "news";
    constructor(
        private globalService: AppGlobalService,
        private activeRouter: ActivatedRoute,
        private routePreload: RouterPreloader,
        private selectivePreloading: SelectivePreloadingStrategy,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private ngZone: NgZone) {
        // this.activeRouter.data.subscribe((data: any) => {
        //     this.subSystem = data.subsystem;
        // });
        // this.activeRouter.params
        //     .map(p => p['id'])
        //     .subscribe(id => {
        //         if (id) this.subSystem = id;
        //     });
        this.activeRouter.queryParams
            .pipe(map(p => p['subappid']))
            .subscribe(id => {
                if (id) this.subSystem = id;
            });
        // pcRootRouterConfig.filter(r => r.outlet)
        //     .forEach(c => {
        //         console.log(c);
        //         if (c && c.data) c.data.preload = true;
        //     });
    }

    preloadModules: string[] = ['purOrder', 'sale'];
    ngOnInit() {

        // let purModuleRef = this.globalService.getModuleRef('PurchaseOrderModule');
        // purModuleRef.moduleLoad$.subscribe(moduleRef => {
        //     if (moduleRef) {
        //         moduleRef.getComponentRef(this._viewRef, PurListComponent);
        //         // purModuleRef.unsubscribe();
        //     }
        // });

        // let saleModuleRef = this.globalService.getModuleRef('sale');
        // let saleSub = saleModuleRef.moduleLoad$.subscribe(action => {
        //     let moduleRef = tryGetValue<IModuleRef>(() => action.data.state).value;
        //     if (moduleRef) {
        //         moduleRef.createComponentRef(this._viewRef, PanelTestComponent);
        //         saleSub.unsubscribe();
        //     }
        // });
        this.ngZone.runOutsideAngular(() => {
            from(this.selectivePreloading.notLoadedModuleInfos)
                .pipe(filter(module => this.preloadModules.contains(module.key)))
                .subscribe(module => {
                    this.ngZone.runOutsideAngular(() => module.loader().subscribe());
                });
        });

    }
    ngAfterViewInit() {
        this.setupStyleEl();
    }

    desktopItem_contextmenu(event: MouseEvent, itemModel: NavDesktopItem) {
        event.preventDefault();
        this._itemContextMenu.show(event, itemModel);
        event.stopPropagation();
    }
    desktopItemMenuItems: MenuItem[] = [
        {
            label: '打开模板',
            icon: 'fa-chevron-right',
            command: (event) => this.openItem({ event, item: event.data })
        },
        {
            label: '移除模板',
            icon: 'fa-chevron-left',
            command: (event) => console.log(event)
        },
        {
            label: '模板属性',
            icon: 'fa-chevron-left',
            command: (event) => console.log(event)
        }
    ];

    // <!--
    // function document.oncontextmenu()
    // {
    // return false;
    // }


    // function nocontextmenu()
    // {
    // if(document.all) {
    // event.cancelBubble=true;
    // event.returnvalue=false;
    // return false;
    // }
    // }
    // -->
    // </script>
    // 第二种方法：在body里加入onmousedown="rclick()" oncontextmenu= "nocontextmenu()"
    // <br>
    // <script language="javascript">
    // <!--
    // function rclick()
    // {
    // if(document.all) {
    // if (event.button == 2){
    // event.returnvalue=false;
    // }
    // }
    // }
    desktop_contextmenu(event: MouseEvent) {
        event.preventDefault();
        this._desktopContextMenu.show(event);
        //  event.stopPropagation();
    }
    desktopMenuItems: MenuItem[] = [
        {
            label: '添加模板',
            icon: 'fa-plus',
            command: (event) => console.log(event.data)
        },
        {
            label: '按列排列',
            icon: 'fa-refresh',
            command: (event) => this.arrangementType = 'col'
        },
        {
            label: '按行排列',
            icon: 'fa-refresh',
            command: (event) => this.arrangementType = 'row'
        },
        {
            label: '刷新',
            icon: 'fa-refresh',
            command: (event) => location.reload(true)
        },
        {
            label: '桌面配置',
            icon: 'fa-cog',
            command: (event) => console.log(event)
        }
    ];

    @Input() arrangementType: string = 'col';

    private async openItem(event: any) {
        let navItem = event.item as NavDesktopItem;
        if (navItem.key.length < 8) {
            navItem.key = UUID.uuid(10, 10).toString();
        }
        let taskGrp: NavTabModel = {
            key: navItem.key,
            name: navItem.key,
            title: navItem.title,
            favicon: navItem.favicon,
            outlet: navItem.outlet,
            active: false,
            showTabContent: this.globalService.showType === ShowTypeEnum.tab ? true : false,
            path: navItem.path,
            daemon: false
        };
        var result = await this.globalService.navTabManager.createNavTab(taskGrp);
        result && result.createGroupList({
            showType: this.globalService.showType || ShowTypeEnum.showForm,
            resolve: { data: 'resolve data' }
        });
    }
    async itemDoubleClickHandler(event: any) {
        this.openItem(event);
    }

    get fCallback() {

        return (value: NavDesktopItem, index: number) => value.subsystem == this.subSystem;
    }

    setupStyleEl() {
        let styleHTML = `
            x-desktop {
                display:flex;
                flex:1 0 100%;
            }
        `;
        styleUntils.setElementStyle(this.elementRef.nativeElement as Element, styleHTML);
    }
}
