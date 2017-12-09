import {
    NgModule, Component, Input, Output, OnInit, AfterViewInit,
    OnDestroy, EventEmitter, ElementRef, ComponentRef, Type, Renderer2
} from '@angular/core';
import { DomHandler } from '../../common/dom/domhandler';
import { CoreModule } from '../../common/shared/shared-module';
import { ChangeDetectorRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
    selector: 'gx-overlayPanel',
    template: `
        <div [ngClass]="'ui-overlaypanel ui-widget ui-widget-content ui-corner-all ui-shadow'" [ngStyle]="style" [class]="styleClass"
            [style.display]="visible ? 'block' : 'none'" (click)="onPanelClick($event)">
            <div [ngClass]="'ui-overlaypanel-content'" [ngStyle]="contentStyle" [class]="contentStyleClass">     
                <ng-container *gxComponentOutlet="componentOutlet;context: compContext"></ng-container>
                <ng-template *gxHostContainer="componentRef;context:compContext"></ng-template>
                <ng-content></ng-content>
            </div>
            <a href="#" *ngIf="showCloseIcon" class="ui-overlaypanel-close ui-state-default" (click)="onCloseClick($event)">
                <span class="fa fa-fw fa-close"></span>
            </a>
        </div>
    `,
    providers: [DomHandler]
})
export class OverlayPanel implements OnInit, AfterViewInit, OnDestroy {

    @Input() dismissable: boolean = true;
    @Input() closeOnEscape: boolean = true;

    @Input() showCloseIcon: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() contentStyleClass: string;
    @Input() contentStyle: any;

    @Input() appendTo: any;

    @Output() onBeforeShow: EventEmitter<any> = new EventEmitter();

    @Output() onAfterShow: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeHide: EventEmitter<any> = new EventEmitter();

    @Output() onAfterHide: EventEmitter<any> = new EventEmitter();

    container: any;

    visible: boolean = false;

    documentClickListener: any;
    documentEscapeListener: any;

    selfClick: boolean;

    targetEvent: boolean;

    target: any;

    constructor(public el: ElementRef,
        public domHandler: DomHandler,
        public renderer: Renderer2,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // if (this.dismissable) {
        //     this.documentClickListener = this.renderer.listen('body', 'click', (event:any) => {
        //         this.close();
        //     });
        // }

        fromEvent<Event>(this.el.nativeElement, 'click')
            .subscribe(event => {
                // event.preventDefault();
                event.stopPropagation();
            });
        if (this.closeOnEscape) {
            this.documentEscapeListener = this.renderer.listen('body', 'keydown', (event: any) => {
                if (event.which == 27) {
                    if (parseInt(this.container.style.zIndex) == DomHandler.zindex) {
                        this.close();
                    }
                }
            });
        }
        this.selectResult.subscribe((res: any) => {
            this.hide();
        });
    }
    close() {
        //  if (!this.selfClick && !this.targetEvent) {
        this.hide();
        // }
        this.selfClick = false;
        this.targetEvent = false;
        this.cd.markForCheck();

    }
    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }
    }

    @Input() position: popupDirection = "right";
    @Input() context: any = {};
    @Input() componentRef: ComponentRef<any>;
    @Input() componentOutlet: Type<any>;
    @Output() selectResult: EventEmitter<any> = new EventEmitter<any>();

    compContext = () => {
        let _overlayPanel = this;
        return {
            modalResult: this.selectResult,
            get context() { return _overlayPanel.context; }
        };
    }

    toggle(event: Event, target?: Element) {
        let currentTarget = (target || event.currentTarget || event.target);
        if (!this.target || this.target == currentTarget) {
            if (this.visible)
                this.hide();
            else
                this.show(event, target);
        }
        else {
            this.show(event, target);
        }

        if (this.dismissable) {
            this.targetEvent = true;
        }

        this.target = currentTarget;
    }

    show(event: Event, target?: Element) {
        if (this.dismissable) {
            this.targetEvent = true;
        }

        if (this.dismissable && !this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('body', 'click', (event: any) => {
                this.close();
            });
        }
        this.onBeforeShow.emit(null);
        let elementTarget = target || event.currentTarget || event.target;
        this.container.style.zIndex = ++DomHandler.zindex;

        this.domHandler.absolutePositionByDirection(this.container, elementTarget, this.position);
        if (this.visible) {
            // let targetEl = (elementTarget as HTMLElement);
            // this.container.style.top = targetEl.offsetTop + targetEl.offsetHeight + 'px';
            // this.container.style.left = targetEl.offsetLeft + 'px';
            // this.domHandler.absolutePosition(this.container, elementTarget);
        }
        else {
            this.visible = true;
            // this.domHandler.absolutePosition(this.container, elementTarget);

            // let targetEl = (elementTarget as HTMLElement);
            // this.container.style.top = targetEl.offsetTop + targetEl.offsetHeight + 'px';
            // this.container.style.left = targetEl.offsetLeft + 'px';

        }
        this.domHandler.fadeIn(this.container, 250);
        this.onAfterShow.emit(null);
    }

    hide() {
        if (this.visible) {
            this.onBeforeHide.emit(null);
            this.visible = false;
            this.onAfterHide.emit(null);
        }
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    onPanelClick(event: any) {
        if (this.dismissable) {
            this.selfClick = true;
        }
    }

    onCloseClick(event: Event) {
        this.hide();

        if (this.dismissable) {
            this.selfClick = true;
        }
        event.preventDefault();
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }

        this.target = null;
    }
}

@NgModule({
    imports: [CoreModule],
    exports: [OverlayPanel],
    declarations: [OverlayPanel]
})
export class OverlayPanelModule { }
