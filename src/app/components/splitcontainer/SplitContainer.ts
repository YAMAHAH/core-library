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
import { SplitterPanelEnum } from './SplitterPanelEnum';

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
        this._updatePanelValue();

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
    @Input() tabIndex = 1;
    @Input() borderStyle: 'none' | 'border';

    @Input() orientation: OrientationEnum = 1;
    @Input() panel1MinSize: number = 55;
    @Input() panel2MinSize: number = 150;
    /**PANEL1占比,用于等比缩放 */
    private _panelProportion;
    /**容器大小改变时固定面板的宽度或高度不变 */
    @Input() fixedPanel: 'none' | 'panel1' | 'panel2' = 'none';
    @Input() collpasePanel: SplitterPanelEnum = 1;
    @Input() collpaseEnable: boolean;

    /**拆分条左或上边缘离容器的初始宽度 */
    private _splitterDistance: any = 200;
    @Input() get splitterDistance() {
        return this._splitterDistance;
    }
    set splitterDistance(value) {
        if (this._splitterDistance != value) {
            this._splitterDistance = value;
            this._updatePanelValue();
        }
    }

    /**拆分条移动的增量值 */
    @Input() splitterIncrement: number = 5;
    /**拆分条的宽度 */
    @Input() splitterWidth: any = 10;
    /**拆分条是否显示或隐藏 */
    @Input() isShowSplitter: boolean = true;
    @Input() resizable: boolean = true;

    @Output() splitterMoved: EventEmitter<any> = new EventEmitter<any>();
    @Output() splitterMoving: EventEmitter<any> = new EventEmitter<any>();
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
        if (this.orientation == 1) {
            if (this.fixedPanel == 'none') {
                this.splitterDistance = Math.max(this.panel1MinSize,
                    (this.container.nativeElement.offsetWidth - this.splitterWidth) * this._panelProportion);
            } else if (this.fixedPanel == 'panel2') {
                let panelWidthSize = this.collpasePanel == 1 ?
                    this.panel2Container.nativeElement.offsetWidth :
                    this.panel1Container.nativeElement.offsetWidth;
                this.splitterDistance = this.container.nativeElement.offsetWidth - panelWidthSize - this.splitterWidth;
            }
        } else {
            if (this.fixedPanel == 'none')
                this.splitterDistance = Math.max(this.panel1MinSize,
                    (this.container.nativeElement.offsetHeight - this.splitterWidth) * this._panelProportion);
            else if (this.fixedPanel == 'panel2') {
                let panelHeightSize = this.collpasePanel == 1 ?
                    this.panel2Container.nativeElement.offsetHeight :
                    this.panel1Container.nativeElement.offsetHeight;
                this.splitterDistance = this.container.nativeElement.offsetHeight - panelHeightSize - this.splitterWidth;
            }
        }
    }
    protected containerKeydownHandler(event: KeyboardEvent) {
        if (event.defaultPrevented) {
            return; //如果已经处理,不再处理
        }
        switch (event.key) {
            case "ArrowLeft":
                if (this.orientation == 1)
                    this.leftAndUpKeyHandler();
                break;
            case "ArrowRight":
                if (this.orientation == 1)
                    this.rightAndDownKeyHandler();
                break;
            case 'ArrowUp':
                if (this.orientation == 2)
                    this.leftAndUpKeyHandler();
                break;

            case "ArrowDown":
                if (this.orientation == 2)
                    this.rightAndDownKeyHandler();
                break;

            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    }

    private get containerSize() {
        let containerSize = (this.orientation == 1 ?
            this.container.nativeElement.offsetWidth : this.container.nativeElement.offsetHeight);
        return containerSize;
    }
    private get containerBorderSize() {
        let borderSize = this.containerSize - (this.orientation == 1 ?
            this.panel1Container.nativeElement.offsetWidth :
            this.panel1Container.nativeElement.offsetHeight) -
            (this.orientation == 1 ?
                this.panel2Container.nativeElement.offsetWidth :
                this.panel2Container.nativeElement.offsetHeight) - this.splitterWidth;
        return borderSize;
    }
    private leftAndUpKeyHandler() {

        let panel1Size = this.collpasePanel == 1 ?
            this.splitterDistance - this.splitterIncrement :
            this.splitterDistance + this.splitterIncrement;

        let panel2Size = this.containerSize - this.containerBorderSize - panel1Size - this.splitterWidth;
        this.calaPanelMaxSize();
        let pane1MinSize = (this.collpasePanel == 1 ? this.panel1MinSize : this.panel2MinSize);
        let pane2MinSize = (this.collpasePanel == 1 ? this.panel2MinSize : this.panel1MinSize);
        if (panel1Size >= pane1MinSize && panel2Size >= pane2MinSize) {
            this.splitterDistance = panel1Size <= this.panel1MaxSize ? panel1Size : this.panel1MaxSize;
            this._collapsed = false;
        }
    }
    private rightAndDownKeyHandler() {

        let panel1Size = this.collpasePanel == 1 ?
            this.splitterDistance + this.splitterIncrement :
            this.splitterDistance - this.splitterIncrement;
        let panel2Size = this.containerSize - this.containerBorderSize - panel1Size - this.splitterWidth;
        this.calaPanelMaxSize();
        let pane1MinSize = (this.collpasePanel == 1 ? this.panel1MinSize : this.panel2MinSize);
        let pane2MinSize = (this.collpasePanel == 1 ? this.panel2MinSize : this.panel1MinSize);

        if (panel1Size >= pane1MinSize && panel2Size >= pane2MinSize) {
            this.splitterDistance = panel1Size <= this.panel1MaxSize ? panel1Size : this.panel1MaxSize;
            this._collapsed = false;
        }

    }
    protected initResize(event, selectPoint: SizingPointEnum) {

        if (this.resizable) {
            this.maskLayerCursorStyle = event.target.style.cursor;

            this.documentResizeListener = this.renderer.listen('body', 'mousemove', (event) => {
                this.onResize(event);
                this.splitterMoving.emit(event);
            });

            this.documentResizeEndListener = this.renderer.listen('body', 'mouseup', (event: Event) => {
                if (this.resizing) {
                    if (this.delCustomStyleFn) {
                        this.delCustomStyleFn();
                        this.delCustomStyleFn = null;
                    }
                    this.resizing = false;
                    this.splitterMoved.emit(event);
                }
                if (this.documentResizeListener && this.documentResizeEndListener) {
                    this.documentResizeListener();
                    this.documentResizeEndListener();
                }
            });

            this.delCustomStyleFn = this.configBodySelectStyles();
            this.resizing = true;
            this.calaPanelMaxSize();
            this.sizingPoint = selectPoint;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
    protected lastPageX;
    protected lastPageY;
    private panel1MaxSize;
    private calaPanelMaxSize() {
        this.panel1MaxSize = this.containerSize - this.containerBorderSize - this.splitterWidth -
            (this.collpasePanel == 1 ? this.panel2MinSize : this.panel1MinSize);
    }
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
                //panel1移动前的宽度
                let panel1Width = this.domHandler.getOuterWidth(this.panel1Container.nativeElement);
                //panel2移动前的宽度
                let panel2Width = this.domHandler.getOuterWidth(this.panel2Container.nativeElement);
                //panel1新的宽度
                let panel1NewWidth = (this.collpasePanel == 1 ? panel1Width - wdir : panel2Width + wdir);
                //panel2新的宽度,collpasePanel指定收缩的面板,一个容器里只支持一个面板收缩
                let panel2NewWidth = (this.collpasePanel == 1 ? panel2Width + wdir : panel1Width - wdir);
                //面板1的最小尺寸,根据收缩面板的设定来获取
                let pane1MinSize = (this.collpasePanel == 1 ? this.panel1MinSize : this.panel2MinSize);
                //面板1的最小尺寸
                let pane2MinSize = (this.collpasePanel == 1 ? this.panel2MinSize : this.panel1MinSize);
                if (panel1NewWidth >= pane1MinSize &&
                    panel1NewWidth <= this.panel1MaxSize &&
                    panel2NewWidth >= pane2MinSize) {
                    this.splitterDistance = panel1NewWidth;
                    this._collapsed = false;
                }
            } else {
                //垂直处理
                let panel1Height = this.domHandler.getOuterHeight(this.panel1Container.nativeElement);
                let panel2Height = this.domHandler.getOuterHeight(this.panel2Container.nativeElement);

                let panel1NewHeight = this.collpasePanel == 1 ? panel1Height - hdir : panel2Height + hdir;
                let panel2NewHeight = this.collpasePanel == 1 ? panel2Height + hdir : panel1Height - hdir;

                if (panel1NewHeight >= (this.collpasePanel == 1 ? this.panel1MinSize : this.panel2MinSize) &&
                    panel1NewHeight <= this.panel1MaxSize &&
                    panel2NewHeight >= (this.collpasePanel == 1 ? this.panel2MinSize : this.panel1MinSize)) {
                    this.splitterDistance = panel1NewHeight;
                    this._collapsed = false;
                }
            }

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
            height: heightValue,
            tabindex: this.tabIndex,
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
    private _panelSize;

    private _updatePanelValue() {
        this._panelSize = this.getStyleValue(this.splitterDistance.toString());
        this._calaPanel1Proportion();
    }
    private _calaPanel1Proportion() {
        this._panelProportion = ((this.orientation == 1) ?
            (this.splitterDistance / (this.container.nativeElement.offsetWidth - this.splitterWidth)) :
            (this.splitterDistance / (this.container.nativeElement.offsetHeight - this.splitterWidth))
        );
    }
    get panel1Style() {
        return this.getPanelStyle(1);
    }
    get panel2Style() {
        return this.getPanelStyle(2);
    }

    getPanelStyle(collpasePanel: SplitterPanelEnum) {
        if (this.collpasePanel == collpasePanel) {
            let value = this._panelSize;
            let style;
            if (this.orientation == 1)
                style = {
                    //  width: value,
                    flex: '0 0 ' + value,
                    height: '100%'
                };
            else
                style = {
                    //   height: value,
                    flex: '0 0 ' + value,
                    width: '100%'
                };
            Object.assign(style, (this.collpasePanel == 1 ? this._panel1Style : this._panel2Style) || {});
            return style;
        } else {
            let style = {
                height: '100%',
                flex: '1',
                width: '100%'
            };
            Object.assign(style, (this.collpasePanel == 1 ? this._panel1Style : this._panel2Style) || {});
            return style;
        }
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
        if (value.endsWith('px') ||
            value.endsWith('em') ||
            value.endsWith('rem') ||
            value.endsWith('%'))
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

    get collapseOrExpandStyleClass() {
        return {
            'fa-chevron-circle-left': (this.orientation == 1 && !this._collapsed) ||
                (this.orientation == 1 && this._collapsed && this.collpasePanel == 2),

            'fa-chevron-circle-right': (this._collapsed && this.orientation == 1 && this.collpasePanel == 1) ||
                (this.orientation == 1 && !this._collapsed && this.collpasePanel == 2),

            'fa-chevron-circle-up': (!this._collapsed && this.orientation == 2) ||
                (this.orientation == 2 && this._collapsed && this.collpasePanel == 2),

            'fa-chevron-circle-down': (this._collapsed && this.orientation == 2 && this.collpasePanel == 1) ||
                (this.orientation == 2 && !this._collapsed && this.collpasePanel == 2)
        }
    }
    private _collapsed: boolean = false;
    private _expandSize;
    collapse(event: Event) {
        event.stopPropagation();
        if (this._collapsed) {
            this.splitterDistance = this.getStyleValue(this._expandSize.toString());
        } else {
            this._expandSize = this.splitterDistance;
            this.splitterDistance = this.getStyleValue(this.collpasePanel == 1 ?
                this.panel1MinSize.toString() :
                this.panel2MinSize.toString());
        }
        this._collapsed = !this._collapsed;
    }


}


