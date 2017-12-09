import { Component, Input } from '@angular/core';
import { ValidatorFn, AsyncValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'gx-form-validation-rule',
    template: `
        <ng-content></ng-content>
    `
})
export class FormValidationRule {
    @Input() message: string;
    @Input() trim: boolean;
    @Input() type: 'required' | 'requiredTrue' | 'pattern' | 'minLength' | 'maxLength' | 'min' | 'max' | 'email' | 'null';
    @Input() max: Date | number;
    @Input() min: Date | number;
    @Input() validationCallback: ValidatorFn;
    @Input() asyncValidationCallback: AsyncValidatorFn;
    @Input() comparisonTarget: Function;
    @Input() comparisonType: string;
    @Input() pattern: RegExp | string;

    get errorMessage() {
        let key = "";
        switch (this.type) {
            case 'required':
                key = 'required';
                break;
            case 'requiredTrue':
                key = 'requiredTrue';
                break;
            case 'pattern':
                key = 'pattern';
                break;
            case 'minLength':
                key = 'minlength';
                break;
            case 'maxLength':
                key = 'maxlength';
                break;
            case 'min':
                key = 'min';
                break;
            case 'max':
                key = 'max';
                break;
            case 'email':
                key = 'email';
                break;
        }
        if (key) return { key: key, errorMessage: this.message };
        return null;
    }

    get validator() {
        switch (this.type) {
            case 'required':
                return Validators.required;
            case 'requiredTrue':
                return Validators.requiredTrue;
            case 'pattern':
                return Validators.pattern(this.pattern);
            case 'minLength':
                return Validators.minLength(<number>this.min);
            case 'maxLength':
                return Validators.maxLength(<number>this.max);
            case 'min':
                return Validators.min(<number>this.min);
            case 'max':
                return Validators.max(<number>this.max);
            case 'email':
                return Validators.email;
            case 'null':
                return Validators.nullValidator;
        }
        if (this.validationCallback) return this.validationCallback;
        if (this.asyncValidationCallback) return this.asyncValidationCallback;
    }

    get asyncValidators() {
        if (this.asyncValidationCallback) return this.asyncValidationCallback;
    }


    constructor() {

    }
}