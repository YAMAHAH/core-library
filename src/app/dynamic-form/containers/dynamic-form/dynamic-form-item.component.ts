import { Component, EventEmitter, Input, OnChanges, OnInit, Output, AfterViewChecked, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FieldConfig } from '../../models/field-config.interface';

@Component({
    exportAs: 'gxDynamicFormItem',
    selector: 'gx-dynamic-form-item',
    styleUrls: ['dynamic-form.component.scss'],
    template: `
        <ng-container gxDynamicField [config]="config" [group]="group">
            <ng-container *ngIf="config && config.childs && config.childs.length > 0">
                <ng-container *ngFor="let field of config.childs;">
                    <gx-dynamic-form-item [config]="field" [group]="group"></gx-dynamic-form-item>
                </ng-container>
            </ng-container>
        </ng-container>
  `
})
export class DynamicFormItemComponent implements OnChanges, OnInit, AfterViewChecked {
    preProcessConfig(config: FieldConfig): void {
        if (config && !config.childs) config.childs = [];
    }
    ngAfterViewChecked(): void {
        this.childFormItems
            .forEach(cItem => this.renderer.removeChild(this.hostEl.nativeElement, cItem.nativeElement));
    }

    @Input()
    config: FieldConfig;

    @Input() group: FormGroup;

    @ViewChildren(DynamicFormItemComponent, { read: ElementRef }) childFormItems: QueryList<ElementRef>;

    get controls() { return this.config.childs.filter(({ editorType }) => editorType !== 'button'); }
    get changes() { return this.group.valueChanges; }
    get valid() { return this.group.valid; }
    get value() { return this.group.value; }

    constructor(private fb: FormBuilder,
        private hostEl: ElementRef,
        private renderer: Renderer2) {
        this.preProcessConfig(this.config);
    }

    ngOnInit() {
        this.group = this.createGroup();
    }

    ngOnChanges() {
        if (this.group && this.config.childs && this.config.childs.length > 0) {
            const prevConfigControls = Object.keys(this.group.controls);
            const currConfigControls = this.controls.map((item) => item.name);
            console.log(prevConfigControls);
            console.log(currConfigControls);
            prevConfigControls
                .filter((control) => !currConfigControls.includes(control))
                .forEach((control) => this.group.removeControl(control));

            currConfigControls
                .filter((control) => !prevConfigControls.includes(control))
                .forEach((name) => {
                    const config = this.config.childs.find((control) => control.name === name);
                    this.group.addControl(name, this.createControl(config));
                });
        }
    }

    createGroup() {
        let group: FormGroup = this.group;
        if (!group) {
            group = this.fb.group({});
        }
        this.controls.forEach(control => group.addControl(control.name, this.createControl(control)));
        return group;
    }

    createControl(config: FieldConfig) {
        if (config.childs && config.childs.length > 0) {
            return this.fb.group({});
        } else {
            const { disabled, validation, value } = config;
            return this.fb.control({ disabled, value }, validation);
        }
    }

    setDisabled(name: string, disable: boolean) {
        if (this.group.controls[name]) {
            const method = disable ? 'disable' : 'enable';
            this.group.controls[name][method]();
            return;
        }

        this.config.childs = this.config.childs.map((item) => {
            if (item.name === name) {
                item.disabled = disable;
            }
            return item;
        });
    }

    setValue(name: string, value: any) {
        this.group.controls[name].setValue(value, { emitEvent: true });
    }
}
