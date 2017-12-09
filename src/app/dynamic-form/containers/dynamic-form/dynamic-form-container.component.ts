import {
    Component, EventEmitter, Input, OnChanges, OnInit, ComponentFactoryResolver, ComponentRef,
    Type, ViewChild, ChangeDetectorRef, AfterViewInit, SimpleChanges, SimpleChange
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { FieldConfig } from '../../models/field-config.interface';
import { Field } from '../../models/field.interface';
import { FormButtonComponent } from '../../components/form-button/form-button.component';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { FormSelectComponent } from '../../components/form-select/form-select.component';
import { FormContainerComponent } from '../../components/form-container/form-container.component';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { PanelContainerComponent } from '../../components/form-container/form-panel.component';

const components: { [type: string]: Type<Field> } = {
    button: FormButtonComponent,
    input: FormInputComponent,
    select: FormSelectComponent,
    form: FormContainerComponent,
    panel: PanelContainerComponent
};

@Component({
    exportAs: 'gxDynamicFormContainer',
    selector: 'gx-dynamic-form-container',
    styleUrls: ['dynamic-form.component.scss'],
    template: `<ng-container gxHostContainer #hostViewLocation="gxHostContainer"></ng-container>`
})
export class DynamicFormContainerComponent implements OnChanges, OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        this.createFormComponent(this.config, this.rootGroup);
    }

    @Input()
    config: FieldConfig;

    rootGroup: FormGroup | FormArray;

    @ViewChild('hostViewLocation') hostViewContainer: HostViewContainerDirective;
    get controls() { return this.config.childs.filter(({ editorType }) => editorType !== 'button'); }
    getControlConfigs(config: FieldConfig) { return config.childs.filter(({ editorType }) => editorType !== 'button') || []; }
    get changes() { return this.rootGroup.valueChanges; }

    getControlChanges(path) {
        if (!path) return this.changes;
        let control = this.getControl(path);
        return control && control.valueChanges || null;
    }
    get valid() { return this.rootGroup.valid; }

    getControlValid(path) {
        if (!path) return this.valid;
        let control = this.getControl(path);
        return control && control.valid || false;
    }
    get value() { return this.rootGroup.value; }

    getControlValue(path) {
        if (!path) return this.value;
        let control = this.getControl(path);
        return control && control.value || null;
    }

    getControl(path: Array<string | number> | string) {
        return this.rootGroup.get(path);
    }

    constructor(private fb: FormBuilder,
        private resolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.rootGroup = this.createGroup(this.config, this.rootGroup);
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
                return v.at(<number>name) || null;
            }

            return null;
        }, control);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let change: SimpleChange = changes[key];
                if (key === 'config') {
                    if (!change.firstChange) {
                        this.compInstances.forEach(ins => ins.destroy());
                        this.createFormComponent(this.config, this.rootGroup);
                    }
                }
            }
        }
        // if (this.group && this.config.childs && this.config.childs.length > 0) {
        //     const prevConfigControls = Object.keys(this.group.controls);
        //     const currConfigControls = this.controls.map((item) => item.name);
        //     prevConfigControls
        //         .filter((control) => !currConfigControls.includes(control))
        //         .forEach((control) => {
        //             if (this.group instanceof FormGroup)
        //                 this.group.removeControl(control)
        //             else this.group.removeAt(0)
        //         });

        //     currConfigControls
        //         .filter((control) => !prevConfigControls.includes(control))
        //         .forEach((name) => {
        //             const config = this.config.childs.find((control) => control.name === name);
        //             if (this.group instanceof FormArray)
        //                 this.group.push(this.createControl(config));
        //             else
        //                 this.group.addControl(name, this.createControl(config));
        //         });
        // }
    }

    compInstances: ComponentRef<any>[] = [];
    createFormComponent(config: FieldConfig, group: FormGroup | FormArray) {

        if (!components[config.editorType]) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `Trying to use an unsupported type (${config.editorType}).
              Supported types: ${supportedTypes}`
            );
        }
        let viewRef = config.viewContainerRef || this.hostViewContainer.viewContainerRef;
        //正式的时候要修改成从其它模块创建引用
        const componentFactory = this.resolver.resolveComponentFactory<Field>(components[config.editorType]);
        let componentRef = viewRef.createComponent(componentFactory);
        componentRef.instance.config = config;
        componentRef.instance.group = group;
        this.compInstances.push(componentRef);

        let events = new Map<string, string>();
        componentFactory.outputs.map(e => events.set(e.templateName, e.propName));
        let props = new Map<string, string>();
        componentFactory.inputs.map(e => props.set(e.templateName, e.propName));

        let options = config.editorOptions;
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const val = options[key];
                if (events.has(key)) {
                    componentRef.instance[events.get(key)].subscribe(val);
                }
                else if (props.has(key)) {
                    componentRef.instance[props.get(key)] = val;
                }
            }
        }

        if (config.childs && config.childs.length > 0)
            this.changeDetectorRef.detectChanges();

        config.childs.forEach((child, index) => {
            child = this.preProcessConfig(child);
            let newGroup = this.createGroup(child, group, index);
            if (child.editorType != 'none') this.createFormComponent(child, newGroup);
        });
    }
    preProcessConfig(config: FieldConfig): FieldConfig {
        if (config && !config.childs) config.childs = [];
        return config;
    }
    createGroup(config: FieldConfig, groupForm: FormGroup | FormArray, index: number = 0) {
        let group = groupForm;
        if (!group) {
            if (config.controlType === 'array')
                group = this.fb.array([]);
            else
                group = this.fb.group({});
        } else if (config.childs.length > 0) {
            if (config.controlType === 'array')
                group = <FormArray>(groupForm.controls[config.name] || groupForm.controls[index]);
            else
                group = <FormGroup>(groupForm.controls[config.name] || groupForm.controls[index]);
        }
        let controls = this.getControlConfigs(config);
        controls.forEach(conf => {
            conf.parent = config;
            if (group instanceof FormArray)
                group.push(this.createControl(conf));
            else
                group.addControl(conf.name, this.createControl(conf));
        });
        return group;
    }

    createControl(config: FieldConfig) {
        if (config.childs && config.childs.length > 0) {
            const { validation, asyncValidation } = config;
            const extras = { validation: validation || [], asyncValidation: asyncValidation || [] };
            if (config.controlType === 'array')
                return this.fb.array([], extras.validation[0], extras.asyncValidation[0]);
            return this.fb.group({}, extras);
        } else {
            const { disabled, validation, value } = config;
            return this.fb.control({ disabled, value }, validation);
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
        //这里有疑问的,做法有待确认
        this.config.childs = this.config.childs.map((item) => {
            if (item.name === name) {
                item.disabled = disable;
            }
            return item;
        });
    }

    expandConfig(root: FieldConfig, callback: (conf: FieldConfig) => void) {
        callback(root);
        root.childs && root.childs.forEach(c => {
            this.expandConfig(c, callback);
        });
    }
    get rootFormGroup() {
        return <FormGroup>this.rootGroup;
    }
    setControlValue(name: string, value: any, options: controlOptions = { emitEvent: true }) {
        this.rootGroup.get(name).setValue(value, options);
    }
    setValue(value: any, options: controlOptions = { emitEvent: true }) {
        this.rootFormGroup.setValue(value, options);
    }
    patchValue(value: any, options: controlOptions = { emitEvent: true }) {
        this.rootFormGroup.patchValue(value, options);
    }
    resetValue(value: any, options: controlOptions = { emitEvent: true }) {
        this.rootFormGroup.reset(value, options);
    }
}

type controlOptions = { onlySelf?: boolean; emitEvent?: boolean; };
