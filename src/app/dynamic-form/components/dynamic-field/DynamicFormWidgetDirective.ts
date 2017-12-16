import {
    Directive, Input, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Injector,
    OnInit, Type, OnChanges, Optional, SimpleChanges, SimpleChange, ElementRef, Inject, ChangeDetectorRef, EmbeddedViewRef, DoCheck, OnDestroy
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Field } from '@framework-dynamic-forms/models/field.interface';
import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { FormContainerComponent } from '../form-container/form-container.component';
import { PanelContainerComponent } from '../form-container/form-panel.component';
import { FieldConfig } from '../../models/field-config.interface';
import { DynamicFormGroupComponent } from '../form-container/FormGroupComponent';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { KeyBindingDirective } from '../../../common/directives/key-binding';
import { ComponentFactoryConatiner } from '@framework-base/component/ComponentFactoryConatiner';
import { FormControlType } from '../../models/form-control-type';
import { tryGetValue } from '@untils/type-checker';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';
import { PortalInjector } from '@angular/cdk/portal';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { Subscription } from 'rxjs/Subscription';


const components: { [type: string]: Type<Field> } = {
    button: FormButtonComponent,
    input: FormInputComponent,
    select: FormSelectComponent,
    form: FormContainerComponent,
    panel: PanelContainerComponent,
    group: DynamicFormGroupComponent
};

@Directive({
    selector: '[gxDynamicFormWidget]'
})
export class DynamicFormWidgetDirective implements OnInit, OnChanges, DoCheck, OnDestroy {
    flexLayoutSubscription: Subscription;
    flexItemSubscription: Subscription;

    @Input() config: FieldConfig;
    @Input() group: FormGroup;

    componentRef: ComponentRef<Field>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
        private cdRef: ChangeDetectorRef,
        @Optional() private globalService: AppGlobalService,
        @Optional() private compfactoryContainer: ComponentFactoryConatiner,
        @Optional() private gxControls: FormControlType
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let change: SimpleChange = changes[key];
                if (key === 'config') {
                    let prev: FieldConfig = change.previousValue;
                    let curr: FieldConfig = change.currentValue;
                    let simpleChange = new SimpleChange(prev && prev.objectId, curr && curr.objectId, change.firstChange);
                    if (this.componentRef) {
                        this.componentRef.instance.keyBinding.createListen(simpleChange);
                        this.componentRef.instance.config = this.config;
                        this.createFormWidgets();
                    }
                }
                if (key === 'group') {
                    if (this.componentRef) {
                        this.componentRef.instance.group = this.group;
                    }
                }
            }
        }
    }
    ngDoCheck(): void {
        let flexItem = tryGetValue(() => this.controlInstance.flexItem).value;
        flexItem && flexItem.ngDoCheck();
        let flexLayout = tryGetValue(() => this.controlInstance.flexContainer).value;
        flexLayout && flexLayout.ngDoCheck();
    }
    ngOnInit() {
        if (this.config) this.createFormWidgets();
    }
    ngOnDestroy(): void {

        let compIns: Field = this._controlInstance;
        if (compIns) {
            compIns.keyBinding && compIns.keyBinding.ngOnDestroy();
            compIns.flexContainer && compIns.flexContainer.ngOnDestroy();
            compIns.flexItem && compIns.flexItem.ngOnDestroy();
        }
        this.flexItemSubscription && this.flexItemSubscription.unsubscribe();
        this.flexLayoutSubscription && this.flexLayoutSubscription.unsubscribe();
    }
    private _controlModel: AbstractControl;
    private get controlModel() {
        if (this._controlModel) return this._controlModel;
        return this._controlModel = this.group.controls[this.config.indexName || this.config.name];
    }
    private _controlInstance: Field;
    private get controlInstance() {
        if (this._controlInstance) return this._controlInstance;
        let controlEx = this.controlModel as abstractControlEx;
        this._controlInstance = tryGetValue(() => controlEx.componentRef.instance).value;
        return this._controlInstance;
    }
    createFlexContainer() {
        let customTokens = new WeakMap<any, any>();
        let parentElRef = tryGetValue(() => (this.group as abstractControlEx).viewRef).value;
        let parentInjector = tryGetValue(() => (this.group as abstractControlEx).componentRef.injector).value;
        customTokens.set(ElementRef, parentElRef);
        let injector = new PortalInjector(parentInjector, customTokens);
        let flexLayout = new FlexLayoutDirective(injector);
        flexLayout.direction = 'column';
        flexLayout.wrap = 'wrap';
        flexLayout.ngOnInit();
        return flexLayout;
    }

    private createFormWidgets() {
        this.cdRef.markForCheck();
        let supportsTypes: FormControlType[] = Array.isArray(this.gxControls) ? this.gxControls : [this.gxControls];
        let compType = tryGetValue(() => supportsTypes.find(c => c.type === this.config.editorType).value).value;
        let hasComp = compType || components[this.config.editorType];
        if (!hasComp) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `Trying to use an unsupported type (${this.config.editorType}).
              Supported types: ${supportedTypes}`
            );
        }
        const componentType = compType || components[this.config.editorType];
        const componentFactory = this.resolver.resolveComponentFactory<Field>(componentType);
        //获取创建组件的属性
        let events = new Map<string, string>();
        componentFactory.outputs.map(e => events.set(e.templateName, e.propName));
        let props = new Map<string, string>();
        componentFactory.inputs.map(e => props.set(e.templateName, e.propName));
        let options = this.config.editorOptions;
        /**事件注销处理 */
        if (this.componentRef) {
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    const val = options[key];
                    if (events.has(key)) {
                        let event = this.componentRef.instance[events.get(key)];
                        event && event.unsubscribe();
                    }
                }
            }
            this.componentRef.destroy();
        }

        this.componentRef = this.container.createComponent(componentFactory, null, this.container.injector);
        this.componentRef.instance.config = this.config;
        this.componentRef.instance.group = this.group;
        /**创建权限绑定控制 */
        let elRef = new ElementRef((this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]) || this.componentRef.instance.contentContainer;
        if (this.config && this.config.objectId) {
            let simpleChange = new SimpleChange(undefined, this.config && this.config.objectId, true);
            this.componentRef.instance.keyBinding = new KeyBindingDirective(this.globalService, this.compfactoryContainer, elRef);
            this.componentRef.instance.keyBinding.objectId = this.config.objectId;
            this.componentRef.instance.keyBinding.createListen(simpleChange);
        }
        /**创建FLEX Container */
        if (this.config && this.config.flexContainer) {
            let customTokens = new WeakMap<any, any>();
            customTokens.set(ElementRef, this.componentRef.instance.contentContainer || elRef);
            let injector = new PortalInjector(this.container.parentInjector, customTokens);

            let flexLayout = new FlexLayoutDirective(injector);
            Object.assign(flexLayout, this.config.flexContainer);
            if (this.flexItemSubscription) this.flexItemSubscription.unsubscribe();
            this.flexLayoutSubscription = flexLayout.simpleChangeUpdate$.subscribe(e => flexLayout._updateWithValue(e));
            this.componentRef.instance.flexContainer = flexLayout;
            flexLayout.ngOnInit();
        }
        /** 创建FLEX ITEM */
        if (this.config && this.config.flexItem) {
            let customTokens = new WeakMap<any, any>();
            customTokens.set(ElementRef, elRef);
            let injector = new PortalInjector(this.container.parentInjector, customTokens);

            let flexContainerParent = tryGetValue(() => (this.group as abstractControlEx).componentRef.instance.flexContainer).value;
            if (!flexContainerParent) flexContainerParent = this.createFlexContainer();

            let flexItem = new FlexItemDirective(injector, flexContainerParent, this.componentRef.instance.flexContainer);
            Object.assign(flexItem, this.config.flexItem);

            flexItem.ngOnInit();
            if (this.flexItemSubscription) this.flexItemSubscription.unsubscribe();
            this.flexItemSubscription = flexItem.simpleChangeUpdate$.subscribe(e => flexItem._updateWithValue(e));
            this.componentRef.instance.flexItem = flexItem;
        }
        /** 设置模型的视图和组件引用 */
        let control = this.group.controls[this.config.indexName || this.config.name];
        if (control) {
            let controlEx = (control as abstractControlEx);
            controlEx.viewRef = elRef;
            controlEx.componentRef = this.componentRef;
        }
        /**处理事件和属性 */
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const val = options[key];
                if (events.has(key)) {
                    let event = this.componentRef.instance[events.get(key)];
                    event && event.subscribe(val);
                }
                else if (props.has(key)) {
                    this.componentRef.instance[props.get(key)] = val;
                }
            }
        }

    }
}


/**
 *      FLEX CONTAINER
 * ctor *
 * OnChanges
 * OnInit *
 * DoCheck *
 * OnDestroy*
 * 
 *      FLEX ITEM
 * ctor *
 * OnChanges
 * OnInit *
 * DoCheck *
 * OnDestroy*
 *      KeyBinding
 * ctor*
 * OnChanges
 * OnDestroy*
 */
