import {
    NgModule, Component, ElementRef, OnInit, OnDestroy, Input, Output,
    EventEmitter, ContentChildren, QueryList, Renderer2, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from '@framework-common/dom/domhandler';
import { SizingPointEnum } from '../form/SelectPointEnum';
import { styleUntils } from '@untils/style';
import { OrientationEnum } from '@framework-components/common/orientation-enum';
import { AfterViewInit } from '@angular/core';


@Component({
    selector: 'gx-split-container',
    templateUrl: './SplitContainer.html',
    styleUrls: ['./splitContainer.scss'],
    providers: [DomHandler]
})
export class HorizontalSplitContainer implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild('panel1', { read: ElementRef }) panel1Container: ElementRef;
    @ViewChild('panel2', { read: ElementRef }) panel2Container: ElementRef;
    @ViewChild('splitter', { read: ElementRef }) splitterContainer: ElementRef;
    constructor(private renderer: Renderer2, private domHandler: DomHandler) {

    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        //设置面板的初始值
    }
    ngOnDestroy() {

    }

    @Input() style = {};
    @Input() styleClass = {};
    /**容器宽度 */
    @Input() width;
    /**容器高度 */
    @Input() height;

    @Input() orientation: OrientationEnum = 1;
    @Input() panel1MinSize: number = 55;
    @Input() Panel2MinSize: number = 150;
    /**移动拆分条固定面板的宽度或高度不变 */
    @Input() fixedPanel: 'none' | 'panel1' | 'panel2' = 'none';

    /**拆分条左或上边缘离容器的初始宽度 */
    @Input() splitterDistance: number = 150;
    /**拆分条移动的增量值 */
    @Input() splitterIncrement: number = 1;
    /**拆分条的宽度 */
    @Input() splitterWidth: any = 5;
    /**拆分条是否启用或禁用 */
    @Input() isSplitterFixed: boolean = false;

    @Output() splitterMoved: EventEmitter<any> = new EventEmitter<any>();
    @Output() splitterMoving: EventEmitter<any> = new EventEmitter<any>();
    @Output() splitterDbClick: EventEmitter<any> = new EventEmitter<any>();
    protected documentResizeListener;
    protected documentResizeEndListener
    protected maskLayerCursorStyle;
    protected delCustomStyleFn;
    //  @Input() resizable: boolean = true;
    protected resizing: boolean;
    protected spEnum = SizingPointEnum;
    protected sizingPoint: SizingPointEnum = SizingPointEnum.none;
    protected splitterMouseDown(event) {
        this.orientation == 1 ?
            this.initResize(event, this.spEnum.leftCenter) :
            this.initResize(event, this.spEnum.topCenter);
    }

    protected initResize(event, selectPoint: SizingPointEnum) {
        if (!this.isSplitterFixed) {
            this.maskLayerCursorStyle = event.target.style.cursor;

            this.documentResizeListener = this.renderer.listen('body', 'mousemove', (event) => {
                this.onResize(event);
            });

            this.documentResizeEndListener = this.renderer.listen('body', 'mouseup', (event: Event) => {
                if (this.resizing) {
                    if (this.delCustomStyleFn) {
                        this.delCustomStyleFn();
                        this.delCustomStyleFn = null;
                    }
                    this.resizing = false;
                }
                if (this.documentResizeListener && this.documentResizeEndListener) {
                    this.documentResizeListener();
                    this.documentResizeEndListener();
                }
            });

            this.delCustomStyleFn = this.configBodySelectStyles();
            this.resizing = true;
            this.sizingPoint = selectPoint;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
    protected configBodySelectStyles() {
        let styleHtml = ` 
        body {
          -webkit-user-select:none;
          user-select:none;
          cursor:${this.maskLayerCursorStyle}
        }`;
        return styleUntils.setElementStyle(document.body, styleHtml);
    }

    get containerStyle() {
        let style = {
            width: this.width + 'px',
            height: this.height + 'px'
        };
        Object.assign(style, this.style);
        return style;
    }
    get containerStyleClass() {
        let styleClass = {
            'horizonatal-split-container': this.orientation == 1,
            'vertical-split-container': this.orientation == 2
        }
        Object.assign(styleClass, this.styleClass);
        return styleClass;
    }

    get panel1Style() {
        let value = this.getStyleValue(this.splitterDistance.toString());
        if (this.orientation == 1)
            return {
                width: value,
                flex: '0 0 ' + value,
                height: '100%'
            };
        else
            return {
                height: value,
                flex: '0 0 ' + value,
                width: '100%'
            };
    }
    get panel2Style() {
        return {
            height: '100%',
            flex: '1',
            width: '100%'
        };
    }

    get panelStyleClass() {
        return {
            'horizonatal-panel': this.orientation == 1,
            'vertical-panel': this.orientation == 2
        };
    }

    get splitterStyleClass() {
        return {
            'horizonatal-splitter': this.orientation == 1,
            'vertical-splitter': this.orientation == 2
        };
    }
    private getStyleValue(value: string) {
        if (!value) return undefined;
        value = value.trim();
        if (value.endsWith('px') || value.endsWith('em') || value.endsWith('rem') || value.endsWith('%'))
            return value;
        else return value + 'px';
    }
    get splitterStyle() {
        let value = this.getStyleValue(this.splitterWidth.toString());
        if (this.orientation == 1)
            return {
                width: value,
                flex: '0 0 ' + value,
                cursor: 'w-resize'
            };
        else
            return {
                height: value,
                flex: '0 0 ' + value,
                cursor: 'n-resize'
            };
    }

    get maskLayerStyleClass() {
        return {
            'split-container-layer-mask': this.resizing
        };
    }

    collapse() {
        let styleProp = this.orientation == 1 ? 'width' : 'height';
        this.renderer.setStyle(this.panel1Container.nativeElement, styleProp, this.panel1MinSize);
    }
    expand() {

    }
    protected lastPageX;
    protected lastPageY;
    protected onResize(event) {
        if (this.resizing) {
            let wdir = 0, hdir = 0, xdir = 0, ydir = 0, deltaX = 0, deltaY = 0;
            deltaX = event.pageX - this.lastPageX;
            deltaY = event.pageY - this.lastPageY;
            switch (this.sizingPoint) {
                case SizingPointEnum.topCenter:
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightTop:
                    wdir += deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightCenter:
                    wdir += deltaX;
                    break;
                case SizingPointEnum.rightBottom:
                    wdir += deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.bottomCenter:
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftBottom:
                    xdir += deltaX;
                    wdir -= deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftCenter:
                    xdir += deltaX;
                    wdir -= deltaX;
                    break;
                case SizingPointEnum.leftTop:
                    xdir += deltaX;
                    wdir -= deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                default:
                    break;
            }
            //水平处理
            if (this.orientation == 1) {
                let panel1Width = this.domHandler.getOuterWidth(this.panel1Container.nativeElement);
                let panel2Width = this.domHandler.getOuterWidth(this.panel2Container.nativeElement);

                let panel1NewWidth = panel1Width - wdir;
                let panel2NewWidth = panel2Width + wdir;

                let panel2LeftPos = parseInt(this.panel2Container.nativeElement.style.left);

                if (panel1NewWidth > this.panel1MinSize && panel2NewWidth > this.Panel2MinSize) {
                    this.setElementWidth(this.panel1Container.nativeElement, panel1NewWidth);
                    this.setElementWidth(this.panel2Container.nativeElement, panel2NewWidth);
                    this.setElementLeft(this.panel2Container.nativeElement, panel2LeftPos + xdir);
                }
            } else {
                //垂直处理
                let panel1Height = this.domHandler.getOuterHeight(this.panel1Container.nativeElement);
                let panel2Height = this.domHandler.getOuterHeight(this.panel2Container.nativeElement);

                let panel1NewHeight = panel1Height - hdir;
                let panel2NewHeight = panel2Height + hdir;

                let panel2TopPos = parseInt(this.panel2Container.nativeElement.style.top);

                if (panel1NewHeight > this.panel1MinSize && panel2NewHeight > this.Panel2MinSize) {
                    this.setElementHeight(this.panel1Container.nativeElement, panel1NewHeight);
                    this.setElementHeight(this.panel2Container.nativeElement, panel2NewHeight);
                    this.setElementTop(this.panel2Container.nativeElement, panel2TopPos + ydir);
                }
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    private setElementWidth(target, value) {
        this.renderer.setStyle(target, 'width', value + 'px');
    }
    private setElementLeft(target, value) {
        this.renderer.setStyle(target, 'left', value + 'px');
    }
    private setElementHeight(target, value) {
        this.renderer.setStyle(target, 'height', value + 'px');
    }
    private setElementTop(target, value) {
        this.renderer.setStyle(target, 'top', value + 'px');
    }
}


