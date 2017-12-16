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

    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    @ViewChild('panel1', { read: ElementRef }) panel1Container: ElementRef;
    @ViewChild('panel2', { read: ElementRef }) panel2Container: ElementRef;
    @ViewChild('splitter', { read: ElementRef }) splitterContainer: ElementRef;
    constructor(private renderer: Renderer2, private domHandler: DomHandler) {

    }
    ngOnInit(): void {
    }
    windowResizeListener;
    ngAfterViewInit(): void {
        this.windowResizeListener = this.renderer.listen('window', 'resize', event => {
            this.containerResizeHandler(event);
        });
        //设置面板的初始值
        this._updatePanel1Value();
    }
    ngOnDestroy() {
        if (this.windowResizeListener) this.windowResizeListener();
    }

    /** 容器样式 */
    @Input() style = {};
    /**容器样式类 */
    @Input() styleClass = {};

    /**面板1样式 */
    @Input('panel1Style') _panel1Style = {};
    /**面板1样式类 */
    @Input() panel1StyleClass = {};
    /** 面板2样式 */
    @Input('panel2Style') _panel2Style = {};
    /**面板2样式类 */
    @Input() panel2StyleClass = {};
    /**容器宽度 */
    @Input() width;
    /**容器高度 */
    @Input() height;
    @Input() borderStyle: 'none' | 'border';

    @Input() orientation: OrientationEnum = 1;
    @Input() panel1MinSize: number = 55;
    @Input() Panel2MinSize: number = 150;
    /**PANEL1占比,用于等比缩放 */
    private _panel1Proportion;
    /**容器大小改变时固定面板的宽度或高度不变 */
    @Input() fixedPanel: 'none' | 'panel1' | 'panel2' = 'none';

    /**拆分条左或上边缘离容器的初始宽度 */
    private _splitterDistance: any = 150;
    @Input() get splitterDistance() {
        return this._splitterDistance;
    }
    set splitterDistance(value) {
        if (this._splitterDistance != value) {
            this._splitterDistance = value;
            this._updatePanel1Value();
        }
    }
    /**拆分条移动的增量值 */
    @Input() splitterIncrement: number = 1;
    /**拆分条的宽度 */
    @Input() splitterWidth: any = 3;
    /**拆分条是否启用或禁用 */
    @Input() isSplitterFixed: boolean = false;

    @Output() splitterMoved: EventEmitter<any> = new EventEmitter<any>();
    @Output() splitterMoving: EventEmitter<any> = new EventEmitter<any>();
    @Output() splitterDbClick: EventEmitter<any> = new EventEmitter<any>();
    protected documentResizeListener;
    protected documentResizeEndListener
    protected maskLayerCursorStyle;
    protected delCustomStyleFn;
    protected resizing: boolean;
    protected spEnum = SizingPointEnum;
    protected sizingPoint: SizingPointEnum = SizingPointEnum.none;
    protected splitterMouseDownHandler(event) {
        this.orientation == 1 ?
            this.initResize(event, this.spEnum.leftCenter) :
            this.initResize(event, this.spEnum.topCenter);
    }
    protected containerResizeHandler(event) {
        //重新计算面板的大小,考虑fixedPanel属性设置
        //初初化时根据splitterDistance初始化面板大小
        if (this.orientation == 1) {
            if (this.fixedPanel == 'none') {
                this.splitterDistance = Math.max(this.panel1MinSize, (this.container.nativeElement.offsetWidth - this.splitterWidth) * this._panel1Proportion);
            } else if (this.fixedPanel == 'panel2')
                this.splitterDistance = this.container.nativeElement.offsetWidth - this.panel2Container.nativeElement.offsetWidth - this.splitterWidth;
        } else {
            if (this.fixedPanel == 'none')
                this.splitterDistance = Math.max(this.panel1MinSize, (this.container.nativeElement.offsetHeight - this.splitterWidth) * this._panel1Proportion);
            else if (this.fixedPanel == 'panel2')
                this.splitterDistance = this.container.nativeElement.offsetHeight - this.panel2Container.nativeElement.offsetHeight - this.splitterWidth;
        }
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
        let widthValue = this.getStyleValue(this.width && this.width.toString() || undefined);
        let heightValue = this.getStyleValue(this.height && this.height.toString() || undefined);
        let style = {
            width: widthValue,
            height: heightValue
        };
        Object.assign(style, this.style);
        return style;
    }
    get containerStyleClass() {
        let styleClass = {
            'horizonatal-split-container': this.orientation == 1,
            'vertical-split-container': this.orientation == 2,
            'ui-split-container-border': this.borderStyle == 'border'
        }
        Object.assign(styleClass, this.styleClass);
        return styleClass;
    }
    private _panel1Size;

    private _updatePanel1Value() {
        this._panel1Size = this.getStyleValue(this.splitterDistance.toString());
        this._calaPanel1Proportion();
    }
    private _calaPanel1Proportion() {
        this._panel1Proportion = ((this.orientation == 1) ?
            (this.splitterDistance / (this.container.nativeElement.offsetWidth - this.splitterWidth)) :
            (this.splitterDistance / (this.container.nativeElement.offsetHeight - this.splitterWidth)));
    }
    get panel1Style() {
        let value = this._panel1Size;
        let style;
        if (this.orientation == 1)
            style = {
                width: value,
                flex: '0 0 ' + value,
                height: '100%'
            };
        else
            style = {
                height: value,
                flex: '0 0 ' + value,
                width: '100%'
            };
        Object.assign(style, this._panel1Style || {});
        return style;
    }
    get panel2Style() {
        let style = {
            height: '100%',
            flex: '1',
            width: '100%'
        };
        Object.assign(style, this._panel2Style || {});
        return style;
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
                    this.splitterDistance = panel1NewWidth;
                    // this.setElementWidth(this.panel1Container.nativeElement, panel1NewWidth);
                    // this.setElementWidth(this.panel2Container.nativeElement, panel2NewWidth);
                    // this.setElementLeft(this.panel2Container.nativeElement, panel2LeftPos + xdir);
                }
            } else {
                //垂直处理
                let panel1Height = this.domHandler.getOuterHeight(this.panel1Container.nativeElement);
                let panel2Height = this.domHandler.getOuterHeight(this.panel2Container.nativeElement);

                let panel1NewHeight = panel1Height - hdir;
                let panel2NewHeight = panel2Height + hdir;

                let panel2TopPos = parseInt(this.panel2Container.nativeElement.style.top);

                if (panel1NewHeight > this.panel1MinSize && panel2NewHeight > this.Panel2MinSize) {
                    this.splitterDistance = panel1NewHeight;
                    // this.setElementHeight(this.panel1Container.nativeElement, panel1NewHeight);
                    // this.setElementHeight(this.panel2Container.nativeElement, panel2NewHeight);
                    // this.setElementTop(this.panel2Container.nativeElement, panel2TopPos + ydir);
                }
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    // private setElementWidth(target, value) {
    //     this.renderer.setStyle(target, 'width', value + 'px');
    // }
    // private setElementLeft(target, value) {
    //     this.renderer.setStyle(target, 'left', value + 'px');
    // }
    // private setElementHeight(target, value) {
    //     this.renderer.setStyle(target, 'height', value + 'px');
    // }
    // private setElementTop(target, value) {
    //     this.renderer.setStyle(target, 'top', value + 'px');
    // }
}


