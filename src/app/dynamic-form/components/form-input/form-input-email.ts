import {
    Component, ViewContainerRef, EventEmitter,
    Input, Output, ElementRef, ViewChild, OnInit, Renderer2
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FormFieldControl } from '../form-field-control';
import { tryGetValue } from '@untils/type-checker';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'gx-form-input-email',
    styleUrls: ['./form-input-email.scss'],
    template: `
        <div [formGroup]="group" class="example-container">
            <mat-form-field [hintLabel]="config.hintLabel" [color]="config.color || 'primary'"
                [floatPlaceholder]="config.floatPlaceholder" [style.fontSize]="config.fontSize || 'inherit'" 
                [hideRequiredMarker]="config.hideRequiredMarker">
                    <input #inputControl type="email" matInput 
                        [placeholder]="config.placeholder" 
                        [required]="required || config.required" 
                        [formControlName]="this.config.indexName || this.config.name"/>

                            <mat-error *ngIf="emailControl.invalid">{{getErrorMessage()}}</mat-error>

                            <mat-placeholder *ngIf="placeholderTemp"> 
                                <ng-container *ngTemplateOutlet="placeholderTemp.tempRef; context: placeholderTemp.context"></ng-container>
                            </mat-placeholder>

                            <ng-container *ngIf="hintStart" ngProjectAs="mat-hint:not([align='end'])">
                                <mat-hint [align]="hintStart.align">
                                    <ng-container *ngTemplateOutlet="hintStart.tempRef; context: hintStart.context"></ng-container>
                                </mat-hint>
                            </ng-container>
                            <ng-container *ngIf="hintEnd" ngProjectAs="mat-hint[align='end']">
                                <mat-hint [align]="hintEnd.align">
                                    <ng-container *ngTemplateOutlet="hintEnd.tempRef; context: hintEnd.context"></ng-container>
                                </mat-hint>
                            </ng-container>

                            <ng-container matPrefix *ngFor="let prefix of prefixTemps" ngProjectAs="[matPrefix]">
                                <ng-container *ngTemplateOutlet="prefix.tempRef; context: prefix.context"></ng-container>
                            </ng-container>
                            <ng-container matSuffix *ngFor="let suffix of suffixTemps" ngProjectAs="[matSuffix]">
                                <ng-container *ngTemplateOutlet="suffix.tempRef; context: suffix.context"></ng-container>
                            </ng-container>

            </mat-form-field>
        </div>
  `
})
export class FormInputEmailComponent extends FormFieldControl implements Field, OnDestroy {


    get hintStart() {
        return this.config.hintTempRefs.find(hint => hint.align === 'start');
    }
    get hintEnd() {
        return this.config.hintTempRefs.find(hint => hint.align === 'end');
    }
    get hintList() {
        let hints = tryGetValue(() => this.config.hintTempRefs).value;
        return hints || [];
    }
    get placeholderTemp() {
        let placeholder = tryGetValue(() => this.config.placeholderTempRef).value;
        return placeholder || null;
    }

    get suffixTemps() {
        let suffixTemps = tryGetValue(() => this.config.suffixTempRefs).value;
        return suffixTemps || [];
        
    }
    get prefixTemps() {
        let prefixTemps = tryGetValue(() => this.config.prefixTempRefs).value;
        return prefixTemps || [];
    }
    controlType: string = 'input-email';
    @Input() readOnly: boolean;
    @Input() required: boolean;
    @Input() visible: boolean;
    setFocus(): void {
        this.focus = true;
    }
    setReadOnly(state) {
        this.readOnly = state;
    }
    config: FieldConfig;
    group: FormGroup;
    keyBinding: KeyBindingDirective;
    flexItem: FlexItemDirective;
    flexContainer: FlexLayoutDirective;


    @ViewChild('inputControl', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

    get emailControl() {

        return this.group.controls[this.config.indexName || this.config.name];
    }
    getErrorMessage() {
        return this.emailControl.hasError('required') ? this.config.customErrors['required'] :
            this.emailControl.hasError('email') ? this.config.customErrors['email'] :
                '';
    }

    constructor(public elementRef: ElementRef, private renderer: Renderer2) {
        super();
        console.log(this.renderer);
    }
    @Input('placeholder') inputPlaceholder: string;
    @Output('onClick') inputClick: EventEmitter<any> = new EventEmitter<any>();

    onClick(event) {
        this.inputClick.emit(event);
    }

    @ViewChild('textInputControl', { read: ElementRef }) selectControl: ElementRef;
    private _focus = false;
    @Input() get focus() {
        return this._focus;
    }
    set focus(value) {
        if (this._focus! = value) {
            this._focus = value;
            if (value)
                this.selectControl.nativeElement.focus();
        }
    }

    ngOnDestroy(): void {
        // if (this.keyBinding) {
        //     this.keyBinding.ngOnDestroy();
        // }
        // if (this.flexContainer) {
        //     this.flexContainer.ngOnDestroy();
        // }
        // if (this.flexItem) {
        //     this.flexItem.ngOnDestroy();
        // }
    }
}
