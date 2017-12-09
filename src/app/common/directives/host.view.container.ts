import { Directive, ViewContainerRef, OnChanges, Input, SimpleChanges, ComponentRef } from '@angular/core';
import { isFunction } from '../toasty/toasty.utils';

@Directive({
    selector: '[gxHostContainer]',
    exportAs: 'gxHostContainer'
})

export class HostViewContainerDirective implements OnChanges {
    @Input("gxHostContainer") componentRef: ComponentRef<any> = null;
    @Input() gxHostContainerContext: any = null;
    @Input() gxHostContainerViewContainerRef: ViewContainerRef = null;
    constructor(public viewContainerRef: ViewContainerRef) { }

    ngOnChanges(changes: SimpleChanges) {
        let viewRef = this.gxHostContainerViewContainerRef || this.viewContainerRef;
        if (viewRef && this.componentRef) {
            viewRef.remove(viewRef.indexOf(this.componentRef.hostView));
            viewRef.clear();
            if (this.gxHostContainerContext) {
                let parseObject = this.gxHostContainerContext;
                if (isFunction(parseObject)) {
                    parseObject = parseObject();
                }
                Object.assign(this.componentRef.instance, parseObject);
                viewRef.insert(this.componentRef.hostView);
            }
        }
    }
}