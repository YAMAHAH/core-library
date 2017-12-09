import {
    Component, ViewContainerRef, EventEmitter, QueryList, Input, Output,
    ViewChild, OnInit, ViewChildren, AfterViewInit
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
export abstract class AbstractFormContainerBase implements Field, AfterViewInit {
    ngAfterViewInit(): void {
        this.config.viewContainerRef = this.hostViewPortal;
        this.config.childs && this.config.childs
            .forEach(c => c.viewContainerRef = this.hostViewPortal);
    }

    @ViewChild('formGroupLocation') formGroupLocation: HostViewContainerDirective;
    @ViewChild('formArrayLocation') formArrayLocation: HostViewContainerDirective;

    get hostViewPortal() {
        return this.isFormGroup ?
            this.formGroupLocation.viewContainerRef :
            this.formArrayLocation.viewContainerRef;
    }

    @Output('onClick')
    panelClick: EventEmitter<any> = new EventEmitter<any>();

    config: FieldConfig;
    group: FormGroup | FormArray;
    keyBinding: KeyBindingDirective;

    flexItem: FlexItemDirective;
    flexContainer: FlexLayoutDirective;

    get isFormGroup() {
        if (this.group instanceof FormGroup) return true;
        return false;
    }
    get valid() { return this.group.valid; }
    get value() { return this.group.value; }

    handleClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.panelClick.emit(this.value);
    }
    constructor(public elementRef: ElementRef2) {

    }
}