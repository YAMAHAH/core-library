import { ModalBase } from '../modal-base';
import { isFunction } from '../toasty/toasty.utils';
import { ComponentRef } from '@angular/core';
import {
    ComponentFactoryResolver, Directive, Injector, Input,
    NgModuleFactory, NgModuleRef, OnChanges, OnDestroy, Provider,
    SimpleChanges, Type, ViewContainerRef
} from '@angular/core';



/**
 * Instantiates a single {@link Component} type and inserts its Host View into current View.
 * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
 *
 * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
 * any existing component will get destroyed.
 *
 * ### Fine tune control
 *
 * You can control the component creation process by using the following optional attributes:
 *
 * * `ngComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
 * the Component. Defaults to the injector of the current view container.
 *
 * * `ngComponentOutletProviders`: Optional injectable objects ({@link Provider}) that are visible
 * to the component.
 *
 * * `ngComponentOutletContent`: Optional list of projectable nodes to insert into the content
 * section of the component, if exists.
 *
 * * `ngComponentOutletNgModuleFactory`: Optional module factory to allow dynamically loading other
 * module, then load a component from that module.
 *
 * ### Syntax
 *
 * Simple
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression"></ng-container>
 * ```
 *
 * Customized injector/content
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   injector: injectorExpression;
 *                                   content: contentNodesExpression;">
 * </ng-container>
 * ```
 *
 * Customized ngModuleFactory
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   ngModuleFactory: moduleFactory;">
 * </ng-container>
 * ```
 * # Example
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
 *
 * A more complete example with additional options:
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
 * A more complete example with ngModuleFactory:
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='NgModuleFactoryExample'}
 *
 * @experimental
 */
@Directive({ selector: '[gxComponentOutlet]' })
export class ComponentOutlet implements OnChanges, OnDestroy {
    @Input() gxComponentOutlet: Type<any>;
    @Input() gxComponentOutletInjector: Injector;
    @Input() gxComponentOutletContent: any[][];
    @Input() gxComponentOutletContext: any;
    @Input() gxComponentOutletNgModuleFactory: NgModuleFactory<any>;

    private _componentRef: ComponentRef<any> = null;
    private _moduleRef: NgModuleRef<any> = null;

    constructor(private _viewContainerRef: ViewContainerRef) { }

    events = new Map<string, string>();
    eventSubscribeds = [];
    props = new Map<string, string>();
    ngOnChanges(changes: SimpleChanges) {
        if (this._componentRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._componentRef.hostView));
        }
        this._viewContainerRef.clear();
        this._componentRef = null;

        if (this.gxComponentOutlet) {
            let injector = this.gxComponentOutletInjector || this._viewContainerRef.parentInjector;

            if ((changes as any).ngComponentOutletNgModuleFactory) {
                if (this._moduleRef) this._moduleRef.destroy();
                if (this.gxComponentOutletNgModuleFactory) {
                    this._moduleRef = this.gxComponentOutletNgModuleFactory.create(injector);
                } else {
                    this._moduleRef = null;
                }
            }
            if (this._moduleRef) {
                injector = this._moduleRef.injector;
            }

            let componentFactory =
                injector.get(ComponentFactoryResolver).resolveComponentFactory(this.gxComponentOutlet);

            componentFactory.outputs.map(e => this.events.set(e.templateName, e.propName));
            componentFactory.inputs.map(e => this.props.set(e.templateName, e.propName));

            this._componentRef = this._viewContainerRef.createComponent(
                componentFactory, this._viewContainerRef.length, injector, this.gxComponentOutletContent);

        }

        if (this.gxComponentOutlet && this.gxComponentOutletContext) {
            let parseObject = this.gxComponentOutletContext;
            if (isFunction(parseObject)) {
                parseObject = parseObject();
            }
            if (parseObject && parseObject.parent && parseObject.componentRefs) {
                let compRefs = parseObject.componentRefs;
                if (!!!compRefs.find((ref: any) => ref === this._componentRef)) { compRefs.push(this._componentRef); }
            }
            if (parseObject.componentRef) {
                Object.assign(parseObject.componentRef.instance, parseObject);
                this._viewContainerRef.insert((parseObject.componentRef as ComponentRef<any>).hostView);
            }
            let compOptions = parseObject.options;
            let compInstance = this._componentRef.instance;
            if (compOptions) {
                for (const key in compOptions) {
                    if (compOptions.hasOwnProperty(key)) {
                        const val = compOptions[key];
                        if (this.events.has(key)) {
                            let event = compInstance[this.events.get(key)];
                            event && event.subscribe(val);
                            this.eventSubscribeds.push(event);
                        }
                        else if (this.props.has(key)) {
                            compInstance[this.props.get(key)] = val;
                        }
                    }
                }
            }
            ["componentOptions"].forEach((item) => {
                delete parseObject[item];
            });
            Object.assign(this._componentRef.instance, parseObject);
        }
    }
    ngOnDestroy() {
        if (this._moduleRef) this._moduleRef.destroy();
        /**事件注销处理 */
        if (this._componentRef) {
            this.eventSubscribeds.forEach(e => {
                e.unsubscribe();
            });
            this._componentRef.destroy();
        }
    }

}