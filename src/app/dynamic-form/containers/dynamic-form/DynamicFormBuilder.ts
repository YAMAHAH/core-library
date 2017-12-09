import {
    Component, OnInit, AfterContentInit, Input, Output, EventEmitter, SimpleChanges, OnChanges,
    QueryList, ContentChildren, ElementRef, Renderer2, AfterViewChecked, AfterViewInit, forwardRef, ComponentRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FieldConfig } from '@framework-dynamic-forms/models/field-config.interface';
import { controlOption } from '../../models/ControlOption';
import { DynamicFormItem } from './DynamicFormItem';
import { AbstractFormBuilder } from './AbstractFormBuilder';
import { Field } from '../../models/field.interface';
import { tryGetValue } from '../../../untils/type-checker';

export const formBuilderProvider = {
    provide: AbstractFormBuilder,
    useExisting: forwardRef(() => DynamicFormBuilder)
};

@Component({
    selector: 'gx-form-builder',
    template: `
    <form *ngIf="rootGroup" [formGroup]="rootGroup" (ngSubmit)="handleSubmit($event)">
        <ng-container gxDynamicFormWidget *ngFor="let field of config" 
            [config]="field" [group]="rootGroup">
        </ng-container>
        <ng-content></ng-content>
    </form>
    `,
    styleUrls: ['./dynamic-form.component.scss'],
    providers: [formBuilderProvider]
})
export class DynamicFormBuilder implements OnChanges, OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {

    @ContentChildren(DynamicFormItem, { read: ElementRef }) formChildElements: QueryList<ElementRef>;
    ngAfterViewInit(): void {
        this.config = this.config.concat(this.contentConfigs);
        this.rootGroup = this.createGroup(this.config, this.rootGroup);
        (this.rootGroup as abstractControlEx).viewRef = this.hostEl;
        this.GetControlTreeMap(this.rootGroup);
    }
    ngAfterContentInit(): void {
        this.contentConfigs = [];
        this.formItems && this.formItems.forEach(item => {
            this.contentConfigs.push(item.itemConfig);
        });
    }
    ngAfterViewChecked(): void {
        this.formChildElements
            .forEach(cItem => this.renderer.removeChild(this.hostEl.nativeElement, cItem.nativeElement));
    }
    contentConfigs: FieldConfig[] = [];
    protected rootGroup: FormGroup | FormArray;
    @Input() config: FieldConfig[] = [];
    @Input() formData: any;
    @Input() labelLocation: 'left' | 'top';
    private _readOnly: boolean = false;
    @Input() get readOnly(): boolean {
        return this._readOnly;
    }
    set readOnly(value) {
        this._readOnly = value;
        this.setReadOnly("", value);
    }
    @Input() width: string;
    @Input() minColWidth: number;
    @Input() height: string;
    @Input() colCount: number;
    @Input() disabled: number;
    @Input() showValidationSummary: boolean;
    @Input() showColonAfterLabel: boolean;
    @Input() tabIndex: number;
    @Input() visible: boolean;

    constructor(
        private hostEl: ElementRef,
        private renderer: Renderer2) { }

    @ContentChildren(DynamicFormItem) private formItems: QueryList<DynamicFormItem>;
    ngOnInit() {

    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.rootGroup) {
            const prevConfigControls = Object.keys(this.rootGroup.controls);
            const currConfigControls = this.controls.map((item) => item.name);
            prevConfigControls
                .filter((control) => !currConfigControls.includes(control))
                .forEach((control, index) => {
                    if (this.rootGroup instanceof FormGroup)
                        this.rootGroup.removeControl(control)
                    else this.rootGroup.removeAt(0)
                });

            currConfigControls
                .filter((control) => !prevConfigControls.includes(control))
                .forEach((name) => {
                    const config = this.config.find((control) => control.name === name);
                    if (this.rootGroup instanceof FormArray)
                        this.rootGroup.push(this.createControl(config));
                    else
                        this.rootGroup.addControl(name, this.createControl(config));
                });
        }
    }
    private createGroup(config: FieldConfig[], formGroup: FormArray | FormGroup) {
        let group = formGroup;
        if (!formGroup)
            group = new FormGroup({});
        this.getControlConfigs(config).forEach((item, index) => {
            let control = this.createControl(item);
            if (item.customErrors) {
                (control as abstractControlEx).customErrors = item.customErrors;
            }
            if (group instanceof FormArray) {
                group.push(control);
                item.indexName = (group as abstractControlEx).tag[item.name] = index.toString();
            } else
                group.addControl(item.name, control);

            if (item.childs && item.childs.length > 0 &&
                (control instanceof FormArray ||
                    control instanceof FormGroup))
                this.createGroup(item.childs, control);
        });
        return group;
    }

    private createControl(config: FieldConfig) {
        const { validation, asyncValidation, updateOn } = config;
        const extras = {
            validators: validation || [],
            asyncValidators: asyncValidation || [],
            updateOn: updateOn
        };
        // validators?: ValidatorFn | ValidatorFn[] | null;
        // asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
        // updateOn?: FormHooks;
        if (config.controlType === 'array') {
            let arr = new FormArray([], extras);
            (arr as abstractControlEx).tag = {};
            return arr;
        } else if (config.controlType === 'group')
            return new FormGroup({}, extras);
        else {
            const { disabled, validation, value } = config;
            return new FormControl({ disabled, value }, extras);
        }
    }

    @Output()
    submit: EventEmitter<any> = new EventEmitter<any>();
    protected handleSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.setReadOnly('', true);
        this.setFocus('name29');
        this.submit.emit(this.value);
    }
    _find(control: AbstractControl, path: Array<string | number> | string, delimiter: string) {
        if (path == null) return null;

        if (!(path instanceof Array)) {
            path = (<string>path).split(delimiter);
        }
        if (path instanceof Array && (path.length === 0)) return null;

        return (<Array<string | number>>path).reduce((v: AbstractControl, name) => {
            if (v instanceof FormGroup) {
                return v.controls[name] || null;
            }

            if (v instanceof FormArray) {
                let key = (v as abstractControlEx).tag[name] || name;
                return v.at(<number>key) || null;
            }

            return null;
        }, control);
    }


    get controls() { return this.config.filter(({ editorType }) => editorType !== 'button') || []; }
    getControlConfigs(config: FieldConfig[]) { return config.filter(({ editorType }) => editorType !== 'button') || []; }
    get changes() { return this.rootGroup.valueChanges; }

    getControlChanges(path) {
        if (!path) return this.changes;
        let control = this.getControl(path);
        return control!.valueChanges || null;
    }

    getControlErrors(path?: string | string[]) {
        let control = path ? this.getControl(path) : this.rootGroup;
        return this.copyErrors(control);
    }

    copyErrors(control) {
        let errors = control ? control.errors : null;
        let customErrors = control ? (control as abstractControlEx).customErrors : null;
        if (errors && customErrors) {
            let srcErrorKeys = Object.keys(errors);
            for (const key in customErrors) {
                if (srcErrorKeys.contains(key)) {
                    errors[key] = customErrors[key];
                }
            }
        }
        return errors;
    }
    getControlError(errorCode: string, path?: string | string[]) {
        let control = path ? this.getControl(path) : this.rootGroup;
        let errors = this.copyErrors(control);
        return errors ? errors[errorCode] : null;
    }

    private _errorResults: { [key: string]: any }[] = [];
    get errorResults() {
        return this._errorResults;
    }

    private getErrors(root: FormControl | FormArray | FormGroup, rootKey: string) {
        this.expandControl(root, rootKey, (control, controlKey) => {
            let errors = this.copyErrors(control);
            let errorResult = errors ? {} : null;
            if (errorResult) errorResult[controlKey] = errors;
            errors && this._errorResults.push(errorResult);
        });
    }

    private _controlTreeMap: { [key: string]: FormControl | FormArray | FormGroup };

    get controlTreeMap() {
        if (!this._controlTreeMap)
            this.GetControlTreeMap(this.rootGroup, "");
        return this._controlTreeMap;
    }

    private getControlKey(controlName: string | string[]) {
        let controlKey: string;
        if (!controlName)
            controlKey = ""
        else if (typeof controlName === 'string')
            controlKey = controlName;
        else
            controlKey = controlName.join('.');

        let controlTreeKeys = Object.keys(this._controlTreeMap);
        if (controlTreeKeys.contains(controlKey)) return controlKey;

        controlKey = controlTreeKeys.filter(key => {
            return key.endsWith((key.includes('.') ? '.' + controlKey : controlKey));
        })[0];
        return controlKey;
    }
    getFormControl(controlName?: string | string[]) {
        if (!this._controlTreeMap) this.GetControlTreeMap(this.rootGroup, "");
        let controlKey;
        if (!controlName)
            controlKey = ""
        else if (typeof controlName === 'string')
            controlKey = controlName;
        else
            controlKey = controlName.join('.');

        let controlTreeKeys = Object.keys(this._controlTreeMap);
        if (controlTreeKeys.contains(controlKey)) return this._controlTreeMap[controlKey];

        controlKey = controlTreeKeys.filter(key => {
            return key.endsWith((key.includes('.') ? '.' + controlKey : controlKey));
        })[0];

        return controlKey && this._controlTreeMap[controlKey];
    }
    private GetControlTreeMap(root: FormControl | FormArray | FormGroup, rootKey: string = "") {
        if (!root) throw Error("root FormGroup is null.");
        if (!rootKey) rootKey = "";
        this._controlTreeMap = {};
        this.expandControl(root, rootKey, (control, controlKey) => {
            this._controlTreeMap[controlKey] = control;
        });
    }
    expandControl(root: FormControl | FormArray | FormGroup, rootKey: string,
        itemHandler: (control: FormControl | FormArray | FormGroup, controlKey: string) => void,
        exitPredicate: (control?: FormControl | FormArray | FormGroup, controlKey?: string) => boolean = () => false) {

        rootKey = rootKey ? rootKey : '';
        if (itemHandler) itemHandler(root, rootKey);
        if (exitPredicate && exitPredicate()) return;

        rootKey = (rootKey ? rootKey + '.' : '');

        if (root instanceof FormGroup) {
            for (const key in root.controls) {
                if (root.controls.hasOwnProperty(key)) {
                    const control = root.controls[key];
                    this.expandControl(<FormGroup>control, rootKey + key, itemHandler);
                }
            }
        }
        if (root instanceof FormArray) {
            let arrayNameMap: string[] = this.getArrayNameMap(root);
            for (let index = 0; index < root.controls.length; index++) {
                const control = root.controls[index];
                this.expandControl(<FormArray>control, rootKey + arrayNameMap[index], itemHandler);
            }
        }
    }

    private getArrayNameMap(root: FormArray) {
        let tag = (root as abstractControlEx).tag;
        if (!root || !tag) return [];
        return Object.keys(tag);
    }
    get valid() {
        let validResult = this.rootGroup && this.rootGroup.valid;
        this._errorResults = [];
        if (validResult === false) {
            this.getErrors(this.rootGroup, '');
        }
        return validResult;
    }

    getControlValid(path) {
        if (!path) return this.valid;
        let control = this.getControl(path);
        return control && control!.valid! || false;
    }
    get value() { return this.rootGroup && this.rootGroup.value; }

    getControlValue(path) {
        if (!path) return this.value;
        let control = this.getControl(path);
        return control && control.value || null;
    }

    getControl(path: Array<string | number> | string) {
        return this._find(this.rootGroup, path, '.') || this.rootGroup.get(path);
    }
    getControlByKey(key: string) {
        return this.findControl(this.rootGroup, key);
    }
    findControl(root: FormGroup | FormArray, key: string) {
        let foundControl = this._find(root, key, '.') || root.get(key);
        if (foundControl) return foundControl;
        for (const key in root.controls) {
            if (root.controls.hasOwnProperty(key)) {
                const control = root.controls[key];
                if (control instanceof FormGroup || control instanceof FormArray)
                    this.findControl(control, key);
            }
        }
        return null;
    }

    get rootFormGroup() {
        return <FormGroup>this.rootGroup;
    }
    formDisabled(name: string = "", disable: boolean = true) {
        if (!name) name = "";
        this.expandControl(this.rootGroup, name, (control, controlKey) => {
            disable ? control.disable() : control.enable();
        }, (control, controlKey) => controlKey === name ? true : false);
    }

    private getControlComponentRef(control) {
        let componentRef = control && (control as abstractControlEx).componentRef as ComponentRef<Field>;
        return componentRef;
    }
    private getControlViewRef(control) {
        let viewRef = control && (control as abstractControlEx).viewRef;
        return viewRef;
    }
    setFocus(name: string | string[]) {
        let controlModel = this.getFormControl(name);
        let viewRef = controlModel && (controlModel as abstractControlEx).viewRef;
        let componentRef = controlModel && (controlModel as abstractControlEx).componentRef as ComponentRef<Field>;
        viewRef && viewRef.nativeElement.focus();
        componentRef && componentRef.instance.setFocus();
    }

    setVisible(name: string | string[], visibleState: boolean) {
        let controlModel = this.getFormControl(name);
        let viewRef = controlModel && (controlModel as abstractControlEx).viewRef;
        if (viewRef) {
            let target = viewRef.nativeElement as HTMLElement;
            this.expandView(target, (target: HTMLElement) => {
                target.hidden = visibleState;
            });
        }
    }

    setEnabled(name: string | string[], enableState: boolean) {
        let controlModel = this.getFormControl(name);
        let viewRef = controlModel && (controlModel as abstractControlEx).viewRef;
        if (viewRef) {
            let target = viewRef.nativeElement as HTMLElement;
            this.expandView(target, (target: HTMLElement) => {
                target.disabled = enableState;
            });
        }
    }

    setReadOnly(name: string | string[], readOnlyState: boolean) {
        let controlModel = this.getFormControl(name);
        let viewRef = this.getControlViewRef(controlModel);
        if (viewRef) {
            let target = viewRef.nativeElement as HTMLElement;
            this.expandView(target, (target: HTMLElement) => {
                target.readOnly = readOnlyState;
            });
        }
        controlModel && this.expandControl(controlModel, this.getControlKey(name),
            (control, controlKey) => {
                let compRef = this.getControlComponentRef(control);
                let setReadOnlyMethod = tryGetValue(() => compRef.instance.setReadOnly).value;
                setReadOnlyMethod && setReadOnlyMethod.call(compRef.instance, readOnlyState);
            });
    }

    expandView(target, viewItemHandler: (htmlItem) => void) {
        if (target && viewItemHandler) viewItemHandler(target);
        for (let index = 0; index < target.children.length; index++) {
            let childElement = target.children[index];
            this.expandView(childElement, viewItemHandler);
        }
    }

    setRequired(name: string | string[], requiredState: boolean) {
        let controlModel = this.getFormControl(name);
        let viewRef = controlModel && (controlModel as abstractControlEx).viewRef;
        if (viewRef) {
            let target = viewRef.nativeElement as HTMLElement;
            this.expandView(target, (target: HTMLElement) => {
                target.required = requiredState;
            });
        }
    }
    setDisabled(name: string, disable: boolean) {
        let control = this.rootGroup.get(name);
        if (!name) control = this.rootGroup;
        if (control) {
            const method = disable ? 'disable' : 'enable';
            control[method]();
            return;
        }
        this.config = this.config.map((item) => {
            if (item.name === name) {
                item.disabled = disable;
            }
            return item;
        });
    }
    setControlValue(name: string, value: any, options: controlOption = { emitEvent: true }) {
        this.rootGroup.get(name).setValue(value, options);
    }
    setValue(value: any, options: controlOption = { emitEvent: true }) {
        this.rootFormGroup.setValue(value, options);
    }
    patchValue(value: any, options: controlOption = { emitEvent: true }) {
        this.rootFormGroup.patchValue(value, options);
    }
    resetValue(value: any, options: controlOption = { emitEvent: true }) {
        this.rootFormGroup.reset(value, options);
    }
}