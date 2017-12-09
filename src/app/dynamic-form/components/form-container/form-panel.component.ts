import { Component, ViewContainerRef, EventEmitter, QueryList, Input, Output, ViewChild, OnInit, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { HostViewContainerDirective } from '@framework-common/directives/host.view.container';
import { FormArray } from '@angular/forms';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

@Component({
    selector: 'gx-Panel',
    styleUrls: ['form-container.component.scss'],
    template: `
        <div *ngIf="isFormGroup; else elseBlock"
            class="dynamic-form" 
            [formGroup]="group" 
            (click)="handleClick($event)">
            <ng-content></ng-content>
            <ng-container gxHostContainer #formGroupLocation="gxHostContainer"></ng-container>
        </div>
        <ng-template #elseBlock>
            <div (click)="handleClick($event)">
                <ng-container gxHostContainer #formArrayLocation="gxHostContainer"></ng-container>
                <ng-content></ng-content>
            </div>
        </ng-template>
  `
})
export class PanelContainerComponent implements Field, AfterViewInit {


    //     <ng-template #elseBlock><input [formControlName]="i">
    //     <div *ngIf="!isFormGroup" [formArrayName]="config.name">
    //         <div *ngFor="let childControl of formArrayControls; let i=index">
    //             <ng-content></ng-content>
    //             <input [formControlName]="i">
    //             <ng-container gxHostContainer #formArrayLocation="gxHostContainer"></ng-container>
    //         </div>
    //     </div>
    // </ng-template>
    //     <div [formGroup]="myGroup">
    //     <div formArrayName="cities">
    //         <div *ngFor="let city of cityArray.controls; index as i">

    //         </div>
    //     </div>
    // </div>

    // cityArray = new FormArray([new FormControl('SF')]);
    // myGroup = new FormGroup({
    //     cities: this.cityArray
    // });
    ngAfterViewInit(): void {
        this.config.viewContainerRef = this.hostViewPortal;
        this.config.childs && this.config.childs
            .forEach((c, idx) => {
                c.viewContainerRef = this.hostViewPortal;
                if (!this.isFormGroup)
                    c.indexName = idx.toString();
                else c.indexName = "";
            });
    }

    arr = new FormArray([
        new FormControl('Nancy', Validators.minLength(2)),
        new FormControl('Drew'),
    ]);
    @ViewChild('formGroupLocation') formGroupLocation: HostViewContainerDirective;
    @ViewChild('formArrayLocation') formArrayLocation: HostViewContainerDirective;

    get hostViewPortal() {
        return this.isFormGroup ? this.formGroupLocation.viewContainerRef :
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

    get formArrayControls() {
        console.log(this.config.name);
        console.log(this.group);
        console.log(this.group.controls);

        return this.group.controls;
    }
    get valid() { return this.group.valid; }
    get value() { return this.group.value; }

    handleClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.panelClick.emit(this.value);
    }
    constructor(public elementRef: ElementRef) {

    }
}