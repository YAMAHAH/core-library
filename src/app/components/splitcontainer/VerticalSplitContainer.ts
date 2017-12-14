import {
    Component, ElementRef, OnInit, OnDestroy, Input, Output,
    EventEmitter, ContentChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from '@framework-common/dom/domhandler';
import { SizingPointEnum } from '../form/SelectPointEnum';
import { Renderer2, ViewChild } from '@angular/core';
import { styleUntils } from '@untils/style';


@Component({
    selector: 'gx-vertical-splitcontainer',
    templateUrl: './VerticalSplitContainer.html',
    providers: [DomHandler]
})
export class VerticalSplitContainer implements OnInit, OnDestroy {

    @ViewChild('left', { read: ElementRef }) leftContainer: ElementRef;
    @ViewChild('right', { read: ElementRef }) rightContainer: ElementRef;
    constructor(private renderer: Renderer2, private domHandler: DomHandler) {

    }
    ngOnInit(): void {

    }
    ngOnDestroy() {

    }

    @Input() leftMinWidth;
    @Input() rightMinWidth;
    documentResizeListener;
    documentResizeEndListener
    frameLayerCursorStyle;
    delCustomStyleFn;
    resizable: boolean;
    resizing: boolean;
    sizingPointEnum: SizingPointEnum;
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
            let leftContainerWidth = this.domHandler.getOuterWidth(this.leftContainer);
            let rightContainerWidth = this.domHandler.getOuterWidth(this.rightContainer);

            let leftNewWidth = leftContainerWidth + wdir;
            let rightNewWidth = rightContainerWidth - wdir;

            let leftPos = parseInt(this.rightContainer.nativeElement.style.left);

            if (leftNewWidth > this.leftMinWidth) {
                this.leftContainer.nativeElement.style.width = leftNewWidth + 'px';
                this.rightContainer.nativeElement.style.width = rightNewWidth + 'px';

                this.rightContainer.nativeElement.style.left = leftPos + xdir + 'px';
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
}