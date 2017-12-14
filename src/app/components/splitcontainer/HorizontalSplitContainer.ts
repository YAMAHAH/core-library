import {
    NgModule, Component, ElementRef, OnInit, OnDestroy, Input, Output,
    EventEmitter, ContentChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from '@framework-common/dom/domhandler';
import { SizingPointEnum } from '../form/SelectPointEnum';
import { Renderer2, ViewChild } from '@angular/core';
import { styleUntils } from '@untils/style';


@Component({
    selector: 'gx-horizontal-split-container',
    templateUrl: './HorizontalSplitContainer.html',
    styleUrls: ['./splitContainer.scss'],
    providers: [DomHandler]
})
export class HorizontalSplitContainer implements OnInit, OnDestroy {

    @ViewChild('auxPanel', { read: ElementRef }) auxPanelContainer: ElementRef;
    @ViewChild('mainPanel', { read: ElementRef }) mainPanelContainer: ElementRef;
    constructor(private renderer: Renderer2, private domHandler: DomHandler) {

    }
    ngOnInit(): void {

    }
    ngOnDestroy() {

    }

    @Input() direction: "Vertical" | "Horizontal" = 'Horizontal';
    @Input() auxPanelMinWidth: number = 55;
    @Input() mainPanelMinWidth: number = 150;

    @Input() auxPanelMinHeight: number = 55;
    @Input() mainPanelMinHeight: number = 150;
    documentResizeListener;
    documentResizeEndListener
    frameLayerCursorStyle;
    delCustomStyleFn;
    @Input() resizable: boolean = true;
    resizing: boolean;
    spEnum = SizingPointEnum;
    sizingPoint: SizingPointEnum = SizingPointEnum.none;
    initResize(event, selectPoint: SizingPointEnum) {
        if (this.resizable) {
            this.frameLayerCursorStyle = event.target.style.cursor;

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
                } if (this.documentResizeListener && this.documentResizeEndListener) {
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
    configBodySelectStyles() {
        let styleHtml = ` 
        body {
          -webkit-user-select:none;
          user-select:none;
        }`;
        return styleUntils.setElementStyle(document.body, styleHtml);
    }

    lastPageX;
    lastPageY;
    onResize(event) {
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
            if (this.direction = 'Horizontal') {
                let auxPanelWidth = this.domHandler.getOuterWidth(this.auxPanelContainer.nativeElement);
                let mainPanelWidth = this.domHandler.getOuterWidth(this.mainPanelContainer.nativeElement);

                let auxPanelNewWidth = auxPanelWidth - wdir;
                let mainPanelNewWidth = mainPanelWidth + wdir;

                let mainPanelLeftPos = parseInt(this.mainPanelContainer.nativeElement.style.left);

                if (auxPanelNewWidth > this.auxPanelMinWidth && mainPanelNewWidth > this.mainPanelMinWidth) {
                    this.setElementWidth(this.auxPanelContainer.nativeElement, auxPanelNewWidth);
                    this.setElementWidth(this.mainPanelContainer.nativeElement, mainPanelNewWidth);
                    this.setElementLeft(this.mainPanelContainer.nativeElement, mainPanelLeftPos + xdir);
                }
            } else {
                //垂直处理
                let auxPanelHeight = this.domHandler.getOuterHeight(this.auxPanelContainer.nativeElement);
                let mainPanelHeight = this.domHandler.getOuterHeight(this.mainPanelContainer.nativeElement);

                let auxPanelNewHeight = auxPanelHeight - hdir;
                let mainPanelNewHeight = mainPanelHeight + hdir;

                let mainPanelTopPos = parseInt(this.mainPanelContainer.nativeElement.style.top);

                if (auxPanelNewHeight > this.auxPanelMinHeight && mainPanelNewHeight > this.mainPanelMinHeight) {
                    this.setElementHeight(this.auxPanelContainer.nativeElement, auxPanelNewHeight);
                    this.setElementHeight(this.mainPanelContainer.nativeElement, mainPanelNewHeight);
                    this.setElementTop(this.mainPanelContainer.nativeElement, mainPanelTopPos + ydir);
                }
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    private setElementWidth(target, value) {
        target.style.width = value + 'px';
    }
    private setElementLeft(target, value) {
        target.style.left = value + 'px';
    }
    private setElementHeight(target, value) {
        target.style.height = value + 'px';
    }
    private setElementTop(target, value) {
        target.style.top = value + 'px';
    }
}


