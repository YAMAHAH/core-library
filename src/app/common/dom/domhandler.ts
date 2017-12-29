import { Injectable } from '@angular/core';

@Injectable()
export class DomHandler {

    public static zindex: number = 1000;

    public addClass(element: any, className: string): void {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    public addMultipleClasses(element: any, className: string | string[]): void {
        if (typeof className === 'string') {
            if (element.classList) {
                let styles: string[] = className.split(' ');
                for (let i = 0; i < styles.length; i++) {
                    if (!this.hasClass(element, styles[i]))
                        element.classList.add(styles[i]);
                }
            }
            else {
                let styles: string[] = className.split(' ');
                for (let i = 0; i < styles.length; i++) {
                    if (!this.hasClass(element, styles[i]))
                        element.className += ' ' + styles[i];
                }
            }
        } else if (Array.isArray(className)) {
            let styles: string[] = className;
            if (element.classList) {
                for (let i = 0; i < styles.length; i++) {
                    if (!this.hasClass(element, styles[i]))
                        element.classList.add(styles[i]);
                }
            }
            else {
                for (let i = 0; i < styles.length; i++) {
                    if (!this.hasClass(element, styles[i]))
                        element.className += ' ' + styles[i];
                }
            }
        }

    }


    public removeClass(element: any, className: string): void {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    public hasClass(element: any, className: string): boolean {
        if (element.classList)
            return element.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }

    public siblings(element: any): any {
        return Array.prototype.filter.call(element.parentNode.children, (child: any) => {
            return child !== element;
        });
    }

    public find(element: any, selector: string): any[] {
        return element.querySelectorAll(selector);
    }

    public findSingle(element: any, selector: string): any {
        return element.querySelector(selector);
    }

    public index(element: any): number {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element) return num;
            if (children[i].nodeType == 1) num++;
        }
        return -1;
    }

    public relativePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ? { width: element.outerWidth, height: element.outerHeight } : this.getHiddenElementDimensions(element);
        let targetHeight = target.offsetHeight;
        let targetWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let viewport = this.getViewport();
        let top, left;

        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height)
            top = -1 * (elementDimensions.height);
        else
            top = targetHeight;

        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    public absolutePosition(element: any, target: any) {
        let elementDimensions = element.offsetParent ?
            { width: element.offsetWidth, height: element.offsetHeight } :
            this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let targetOuterHeight = target.offsetHeight;
        let targetOuterWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let viewport = this.getViewport();
        let top, left;
        let targetParentIsBody = target.offsetParent.tagName === 'BODY';
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height)
            if (targetParentIsBody)
                top = targetOffset.top + windowScrollTop - elementOuterHeight;
            else
                top = target.offsetTop + windowScrollTop - elementOuterHeight;
        else {
            if (targetParentIsBody)
                top = targetOuterHeight + targetOffset.top + windowScrollTop;
            else
                top = targetOuterHeight + windowScrollTop;
        }

        if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width)
            if (targetParentIsBody)
                left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
            else
                left = target.offsetLeft + windowScrollLeft + targetOuterWidth - elementOuterWidth;
        else
            if (targetParentIsBody)
                left = targetOffset.left + windowScrollLeft;
            else
                left = target.offsetLeft + windowScrollLeft;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    public absolutePositionByDirection(element: any, target: any, direction: popupDirection = 'right') {
        let elementDimensions = element.offsetParent ?
            { width: element.offsetWidth, height: element.offsetHeight } :
            this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let targetOuterHeight = target.offsetHeight;
        let targetOuterWidth = target.offsetWidth;
        let targetOffset: ClientRect = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let viewport = this.getViewport();
        let top, left;

        if (direction == 'left') {
            top = targetOffset.top;
            left = targetOffset.left - elementOuterWidth;
            if (targetOffset.left - Math.abs(left) < elementOuterWidth)
                if (targetOffset.right + elementOuterWidth < viewport.width)
                    left = targetOffset.right;
                else left = 0;
            if (targetOffset.top + elementOuterHeight > viewport.height)
                if (targetOffset.top - elementOuterHeight > -1)
                    top = targetOffset.top - elementOuterHeight;
                else top = viewport.height - elementOuterHeight;
        }
        if (direction == 'right') {
            top = targetOffset.top;
            left = targetOffset.right;
            if (targetOffset.right + elementOuterWidth > viewport.width)
                if (targetOffset.left - elementOuterWidth > -1)
                    left = targetOffset.left - elementOuterWidth;
                else left = viewport.width - elementOuterWidth;
            if (targetOffset.top + elementOuterHeight > viewport.height)
                if (targetOffset.top - elementOuterHeight > -1)
                    top = targetOffset.top - elementOuterHeight;
                else top = viewport.height - elementOuterHeight;
        }
        if (direction == 'top') {
            top = targetOffset.top - elementOuterHeight;
            left = targetOffset.left;
            if (targetOffset.left + elementOuterWidth > viewport.width)
                if (targetOffset.left - elementOuterWidth > -1)
                    left = targetOffset.left - elementOuterWidth;
                else left = viewport.width - elementOuterWidth;
            if (targetOffset.top - Math.abs(top) < elementOuterHeight)
                if (targetOffset.bottom + elementOuterHeight > -1)
                    top = targetOffset.bottom;
                else top = 0;
        }
        if (direction == 'bottom') {
            top = targetOffset.bottom;
            left = targetOffset.left;
            if (targetOffset.left + elementOuterWidth > viewport.width)
                if (targetOffset.left - elementOuterWidth > -1)
                    left = targetOffset.left - elementOuterWidth;
                else left = viewport.width - elementOuterWidth;

            if (targetOffset.bottom + elementOuterHeight > viewport.height)
                if (targetOffset.top - elementOuterHeight > -1)
                    top = targetOffset.top - elementOuterHeight;
                else top = viewport.height - elementOuterHeight;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';

    }

    private menuPopup(element: any, docPoint: { x: number; y: number }) {
        let elementDimensions = element.offsetParent ?
            {
                width: element.offsetWidth,
                height: element.offsetHeight
            } :
            this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let viewport = this.getViewport();
        let left = docPoint.x, top = docPoint.y;
        if (left + elementOuterWidth > viewport.width)
            left = viewport.width - elementOuterWidth;

        if (top + elementOuterHeight > viewport.height)
            top = viewport.height - elementOuterHeight;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    public getHiddenElementOuterHeight(element: any): number {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return elementHeight;
    }

    public getHiddenElementOuterWidth(element: any): number {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return elementWidth;
    }

    public getHiddenElementDimensions(element: any): any {
        let dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return dimensions;
    }

    public scrollInView(container: any, item: any) {
        let borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);

        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if ((offset + itemHeight) > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }

    public fadeIn(element: any, duration: number): void {
        element.style.opacity = 0;

        let last = +new Date();
        let opacity = 0;
        let tick = function () {
            opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
            element.style.opacity = opacity;
            last = +new Date();

            if (+opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }

    public fadeOut(element: any, ms: number) {
        var opacity = 1,
            interval = 50,
            duration = ms,
            gap = interval / duration;

        let fading = setInterval(() => {
            opacity = opacity - gap;

            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
            }

            element.style.opacity = opacity;
        }, interval);
    }

    public getWindowScrollTop(): number {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    public getWindowScrollLeft(): number {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

    public matches(element: any, selector: string): boolean {
        var p = Element.prototype;
        var f = p['matches'] || p.webkitMatchesSelector || p['mozMatchesSelector'] || p.msMatchesSelector || function (s: any) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(element, selector);
    }

    public getOuterWidth(el: any, margin?: boolean) {
        let width = el.offsetWidth;
        if (margin) {
            let style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }

        return width;
    }

    public getHorizontalPadding(el: any) {
        let style = getComputedStyle(el);
        return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }

    public getHorizontalMargin(el: any) {
        let style = getComputedStyle(el);
        return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    public innerWidth(el: any) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);

        width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }

    public width(el: any) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);

        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }

    public getOuterHeight(el: any, margin?: boolean) {
        let height = el.offsetHeight;

        if (margin) {
            let style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }

        return height;
    }

    public getHeight(el: any): number {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);

        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

        return height;
    }

    public getWidth(el: any): number {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);

        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

        return width;
    }

    public getViewport(): { width: number, height: number } {
        let win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;

        return { width: w, height: h };
    }

    public getOffset(el) {
        let x = el.offsetLeft;
        let y = el.offsetTop;

        while (el = el.offsetParent) {
            x += el.offsetLeft;
            y += el.offsetTop;
        }

        return { left: x, top: y };
    }

    public getRect(element: any) {
        return {
            left: element.style.left,
            top: element.style.left,
            width: element.style.width,
            height: element.style.height
        };
    }

    public equals(obj1: any, obj2: any): boolean {
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if (obj1 == null || obj2 == null) {
            return false;
        }

        if (obj1 == obj2) {
            delete obj1._$visited;
            return true;
        }

        if (typeof obj1 == 'object' && typeof obj2 == 'object') {
            obj1._$visited = true;
            for (var p in obj1) {
                if (p === "_$visited") continue;
                if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                    return false;
                }

                switch (typeof (obj1[p])) {
                    case 'object':
                        if (obj1[p] && obj1[p]._$visited || !this.equals(obj1[p], obj2[p])) return false;
                        break;

                    case 'function':
                        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                        break;

                    default:
                        if (obj1[p] != obj2[p]) return false;
                        break;
                }
            }

            for (var p in obj2) {
                if (typeof (obj1[p]) == 'undefined') return false;
            }

            delete obj1._$visited;
            return true;
        }

        return false;
    }

    getUserAgent(): string {
        return navigator.userAgent;
    }

    isIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return true;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return true;
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return true;
        }

        // other browser
        return false;
    }

    appendChild(element: any, target: any) {
        if (this.isElement(target))
            target.appendChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.appendChild(element);
        else
            throw 'Cannot append ' + target + ' to ' + element;
    }

    removeChild(element: any, target: any) {
        if (this.isElement(target))
            target.removeChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.removeChild(element);
        else
            throw 'Cannot remove ' + element + ' from ' + target;
    }

    isElement(obj: any) {
        return (typeof HTMLElement === "object" ? obj instanceof HTMLElement :
            obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
        );
    }

    calculateScrollbarWidth(): number {
        let scrollDiv = document.createElement("div");
        scrollDiv.className = "ui-scrollbar-measure";
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        return scrollbarWidth;
    }

    launchFullScreen(element: Element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
