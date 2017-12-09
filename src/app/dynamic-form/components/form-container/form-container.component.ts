import { Component, ViewContainerRef, EventEmitter, Input, Output, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

@Component({
    selector: 'gx-form',
    styleUrls: ['form-container.component.scss'],
    template: `
    <form
        class="dynamic-form" 
        [formGroup]="group" 
        (ngSubmit)="handleSubmit($event)">
        <ng-content></ng-content>
        <ng-container gxHostContainer #viewPortalAs="gxHostContainer"></ng-container>
    </form>
  `
})
export class FormContainerComponent implements Field, AfterViewInit {
    ngAfterViewInit(): void {
        this.config.viewContainerRef = this.hostViewPortal;
        this.config.childs && this.config.childs
            .forEach(c => c.viewContainerRef = this.hostViewPortal);
    }
    @ViewChild('viewPortalAs') hostViewContainer: HostViewContainerDirective;

    get hostViewPortal() {
        return this.hostViewContainer.viewContainerRef;
    }

    @Output('onSubmit')
    submit: EventEmitter<any> = new EventEmitter<any>();

    config: FieldConfig;
    group: FormGroup;
    keyBinding: KeyBindingDirective;
    flexItem: FlexItemDirective;
    flexContainer: FlexLayoutDirective;
    get valid() { return this.group.valid; }
    get value() { return this.group.value; }
    constructor(public elementRef: ElementRef) {

    }

    handleSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.submit.emit(this.value);
    }
}