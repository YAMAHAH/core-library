import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { Field } from '../../models/field.interface';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

@Component({
    selector: 'gx-dynamic-form-group',
    template: `
        <div style="display:flex;flex-direction:'column';flex:1 0 100%">
            <div class="gx-form-group-caption">{{config.label}}</div>
            <div #container class="gx-form-group-content" style="width:100%;border-top: 1px solid rgb(221, 221,221);" [formGroup]="group">
                <ng-container gxDynamicFormWidget 
                    *ngFor="let field of config.childs" 
                    [config]="field" 
                    [group]="group.controls[(config.indexName || config.name)]">
                </ng-container>
            </div>
        </div>
    `
})
export class DynamicFormGroupComponent implements Field {

    config: FieldConfig;
    group: FormGroup;
    keyBinding: KeyBindingDirective;
    flexItem: FlexItemDirective;
    flexContainer: FlexLayoutDirective;
    @ViewChild('container', { read: ElementRef }) private _contentContainer: ElementRef;
    get contentContainer(): ElementRef {
        return this.elementRef || this._contentContainer;
    }

    constructor(public elementRef: ElementRef) {

    }

}
