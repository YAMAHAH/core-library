import { Component, AfterViewInit, Output, EventEmitter, Input, Renderer, HostListener, Renderer2, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { OverlayPanel } from '../overlaypanel/overlaypanel';
import { filter, map, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

export interface SideItem {
    skipLocationChange?: boolean;
    title: string;
    iconCss?: string;
    routerLink?: string;
    queryParams?: any;

}

export enum SideExpandControlTypeEnum {
    hover,
    click
}

@Component({
    moduleId: module.id,
    selector: 'x-side-silder-menu',
    templateUrl: 'side-silder-menu.component.html',
    styleUrls: ['side-silder-menu.component.css']
})
export class SideSilderMenuComponent implements AfterViewInit {

    constructor(private hostElementRef: ElementRef, private renderer: Renderer2) {

    }

    @ViewChild("popup") itemPopupMenuRef: OverlayPanel;
    @ViewChild("bottomPopup") itemPopupMenuRef2: OverlayPanel;
    menuItems: NodeListOf<Element>;
    ngAfterViewInit(): void {
        //let childElements = this.hostElementRef.nativeElement.querySelectorAll(".side-silder-menu,.side-silder-menu ul>li>a,.side-silder-menu input,.side-silder-menu button");
        fromEvent(this.hostElementRef.nativeElement, 'click')
            .subscribe((event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
            });

        this.menuItems = this.itemPopupMenuRef.el.nativeElement.querySelectorAll("div.flex-row-col.flex-col-xs");
        let active: any;
        fromEvent<Event>(this.menuItems, 'mouseover')
            .pipe(filter(e => this.hasElement(e.currentTarget)),
            map(e => {
                event.preventDefault();
                event.stopPropagation();
                return e.currentTarget;
            }),
            switchMap(e => [e]))
            .subscribe(el => {
                if (el != active) {
                    this.renderer.addClass(el, "menuStandartItemOver_Mouse");
                    active = el;
                }
            });
        fromEvent<Event>(this.menuItems, 'mouseleave')
            .pipe(filter(e => this.hasElement(e.currentTarget)),
            map(e => {
                event.preventDefault();
                event.stopPropagation();
                return e.currentTarget;
            }),
            switchMap(e => [e]))
            .subscribe((el) => {

                this.renderer.removeClass(el, "menuStandartItemOver_Mouse");
                active = null;
            });

        fromEvent<Event>(this.menuItems, 'click')
            .pipe(
            filter(e => this.hasElement(e.currentTarget)),
            switchMap(e => [e]))
            .subscribe(el => {
                this.itemPopupMenuRef.close();
            });
    }
    private foundParentElement(element: any) {
        let foundEl = element;
        while (foundEl) {
            for (let index = 0; index < this.menuItems.length; index++) {
                if (this.menuItems[index] === foundEl) return foundEl;
            }
            foundEl = foundEl.parentElement;
        }
        return null;
    }
    private hasElement(element: any) {
        for (let index = 0; index < this.menuItems.length; index++) {
            if (this.menuItems[index] === element) return true;
        }
        return false;
    }
    items: SideItem[] = [
        {
            title: "我的应用",
            iconCss: "fa fa-home fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'myapp' }
        },
        {
            title: "基础管理",
            iconCss: "fa fa-heart-o fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: "news" }
        },
        {
            title: "产品管理",
            iconCss: "fa fa-picture-o fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "销售管理",
            iconCss: "fa fa-clock-o fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "生产管理",
            iconCss: "fa fa-desktop fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "品质管理",
            iconCss: "fa fa-plane fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "财务管理",
            iconCss: "fa fa-shopping-cart",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "仓库管理",
            iconCss: "fa fa-microphone fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "采购管理",
            iconCss: "fa fa-flask fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "外协管理",
            iconCss: "fa fa-align-left fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "系统维护",
            iconCss: "fa fa-microphone fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "行政管理",
            iconCss: "fa fa-glass fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        },
        {
            title: "资产管理",
            iconCss: "fa fa-rocket fa-lg",
            skipLocationChange: true,
            routerLink: "/pc/desktop",
            queryParams: { subappid: 'snews' }
        }
    ];

    itemClick(event: Event) {
        event.preventDefault();
    }

    testClick(event: any) {

    }
    @Input() expandType: SideExpandControlTypeEnum = SideExpandControlTypeEnum.click;
    @Output() menuHover: EventEmitter<any> = new EventEmitter<any>();
    @Output() menuLeave: EventEmitter<any> = new EventEmitter<any>();
    @Output() menuExpanded: EventEmitter<any> = new EventEmitter<any>();
    isExpanded: boolean = false;
    headerClickHandler(event: Event) {

    }
    documentClickListener: any;
    expandClick(event: Event) {
        event.stopPropagation();
        if (this.expandType === SideExpandControlTypeEnum.click) {
            this.expand(event);
        }
    }
    // @HostListener("document:click", ['$event'])
    expand(event: any) {
        this.isExpanded = !this.isExpanded;
        this.menuExpanded.emit({ event: event, data: this.isExpanded });

        if (this.isExpanded) {
            this.documentClickListener = this.renderer.listen('body', 'click', (e: any) => {
                this.expand(event);
            });
        } else {
            this.documentClickListener && this.documentClickListener();
        }
    }

    mouseOverHandler(event: MouseEvent) {
        event.preventDefault();
        if (this.expandType === SideExpandControlTypeEnum.hover) {
            this.isExpanded = true;
            this.menuExpanded.emit({ event: event, data: this.isExpanded });
        }
        this.menuHover.emit(event);
    }
    mouseLeaveHandler(event: MouseEvent) {
        event.preventDefault();
        if (this.expandType === SideExpandControlTypeEnum.hover) {
            this.isExpanded = false;
            this.menuExpanded.emit({ event: event, data: this.isExpanded });
        }
        this.menuLeave.emit(event);
    }

}
