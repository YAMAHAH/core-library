import {
    OnInit, OnChanges, Component, SimpleChanges, Input, AfterContentInit, ContentChildren,
    QueryList, Optional, SkipSelf, Host, ContentChild, ComponentRef, TemplateRef, ViewContainerRef
} from '@angular/core';
import { FieldConfig, controlType } from '@framework-dynamic-forms/models/field-config.interface';
import { FormArray, FormGroup } from '@angular/forms/src/model';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { FormValidationRule } from './FormValidationRule';
import { DynamicFormBuilder } from '@framework-dynamic-forms/containers/dynamic-form/DynamicFormBuilder';
import { AbstractFormBuilder } from './AbstractFormBuilder';
import { FloatPlaceholderType } from '@angular/material';
import { FormItemPlaceholder } from './FormItemPlaceholder';
import { FormItemHint } from './FormItemHint';
import { FormItemPrefix } from './FormItemPrefix';
import { FormItemSuffix } from './FormItemSuffix';
import { FormItemFlexLayout } from './FormItemFlexLayout';
import { FormItemFlexItem } from './FormItemFlexItem';

@Component({
    selector: 'gx-form-item',
    template: `
        <ng-content></ng-content>
    `
})
export class DynamicFormItem implements OnInit, OnChanges, AfterContentInit {

    @ContentChild(FormItemPlaceholder) private _placeholderChild: FormItemPlaceholder;
    @ContentChildren(FormItemHint) private _itemHintTemps: QueryList<FormItemHint>;
    @ContentChildren(FormItemPrefix) private _itemPrefixTemps: QueryList<FormItemPrefix>;
    @ContentChildren(FormItemSuffix) private _itemSuffixTemps: QueryList<FormItemSuffix>;
    @ContentChildren(DynamicFormItem) private _formItems: QueryList<DynamicFormItem>;
    @ContentChildren(FormValidationRule) private _formItemValidationRules: QueryList<FormValidationRule>;
    @ContentChildren(FormItemFlexLayout, { descendants: false }) private _formItemFlexLayout: QueryList<FormItemFlexLayout>;
    @ContentChildren(FormItemFlexItem, { descendants: false }) private _formItemFlexItem: QueryList<FormItemFlexItem>;
    ngAfterContentInit(): void {
        let errors: { [key: string]: any } = {};
        let validators = [];
        this._formItemValidationRules.forEach(item => {
            if (item.errorMessage) errors[item.errorMessage.key] = item.errorMessage.errorMessage;
            item.validator && validators.push(item.validator);
        });
        this.itemConfig.customErrors = errors;
        this.itemConfig.validation = this.itemConfig.validation ? validators.concat(this.itemConfig.validation) : validators;

        this.itemConfig.childs = [];
        this.formItems && this.formItems.forEach(item => {
            this.itemConfig.childs.push(item.itemConfig);
        });

        if (this._placeholderChild)
            this.itemConfig.placeholderTempRef = {
                tempRef: this._placeholderChild.placeholderTempRef,
                context: this._placeholderChild.data
            };

        if (this._itemHintTemps) {
            let hintTemps = this._itemHintTemps.map(hint => {
                return { align: hint.align, tempRef: hint.hintTempRef, context: { $implicit: hint.data } }
            });
            this.itemConfig.hintTempRefs = hintTemps;
        } else this.itemConfig.hintTempRefs = [];

        if (this._itemPrefixTemps) {
            let prefixTemps = this._itemPrefixTemps.map(prefix => {
                return { tempRef: prefix.prefixTempRef, context: { $implicit: prefix.data } }
            });
            this.itemConfig.prefixTempRefs = prefixTemps;
        } else this.itemConfig.prefixTempRefs = [];

        if (this._itemSuffixTemps) {
            let suffixTemps = this._itemSuffixTemps.map(suffix => {
                return { tempRef: suffix.suffixTempRef, context: { $implicit: suffix.data } }
            });
            this.itemConfig.suffixTempRefs = suffixTemps;
        } else this.itemConfig.suffixTempRefs = [];

        if (this._formItemFlexItem.length > 0)
            this.itemConfig.flexItem = this._formItemFlexItem
                .reduce((prev, curr, curIdx, array) => {
                    return Object.assign(prev, curr);
                }, new FormItemFlexItem());

        if (this._formItemFlexLayout.length > 0)
            this.itemConfig.flexContainer = this._formItemFlexLayout
                .reduce((prev, curr, curIdx, array) => {
                    return Object.assign(prev, curr);
                }, new FormItemFlexLayout());
    }

    private createValidators(): ValidatorFn {
        let config = this.itemConfig;
        let validator: ValidatorFn;
        // if (config.required) {
        //   validator = Validators.required;
        // }
        // if (config.max || config.max === 0) {
        //   validator = Validators.compose([validator, Validators.max(parseFloat(config.max))]);
        // }
        // if (config.min || config.min === 0) {
        //   validator = Validators.compose([validator, Validators.min(parseFloat(config.min))]);
        // }
        // if (config.maxLength || config.maxLength === 0) {
        //   validator = Validators.compose([validator, Validators.maxLength(parseFloat(config.maxLength))]);
        // }
        // if (config.minLength || config.minLength === 0) {
        //   validator = Validators.compose([validator, Validators.minLength(parseFloat(config.minLength))]);
        // }
        // // Add provided custom validators to the validator function
        // if (config.validators) {
        //   config.validators.forEach((validatorConfig: ITdDynamicElementValidator) => {
        //     validator = Validators.compose([validator, validatorConfig.validator]);
        //   });
        // }
        return validator;
    }
    get formItems() {
        return this._formItems.filter(item => item !== this);
    }
    private _itemConfig: FieldConfig;
    @Input() get itemConfig(): FieldConfig {
        if (!this._itemConfig) this._itemConfig = {
            editorType: this.itemType,
            controlType: this.controlType,
            objectId: this.objectId,
            name: this.dataField,
            label: this.label,
            color: this.color || 'primary',
            fontSize: this.fontSize.endsWith('px' || 'rem' || 'em') ? this.fontSize : this.fontSize + 'px',
            labelLocation: this.labelLocation,
            placeholder: this.itemPlaceholder || this.editorOptions && this.editorOptions.placeholder,
            editorOptions: this.editorOptions,
            required: this.editorOptions && this.editorOptions.required,
            validation: this.validation,
            asyncValidation: this.asyncValidation,
            value: this.itemValue,
            updateOn: this.updateOn,
            hideRequiredMarker: this.hideRequiredMarker,
            floatPlaceholder: this.floatPlaceholder,
            hintLabel: this.hintLabel,
            childs: []
        };
        return this._itemConfig;
    };
    set itemConfig(value: FieldConfig) {
        this._itemConfig = value;
    }
    @Input() itemGroup: FormArray | FormGroup;
    @Input() itemType: string;
    @Input() controlType?: controlType = 'control';
    @Input() objectId: string;
    @Input() dataField: string;
    @Input() editorOptions: { [key: string]: any };
    @Input() validation: ValidatorFn[] = [];
    @Input() asyncValidation: AsyncValidatorFn[];
    @Input() updateOn: 'blur' | 'submit' | 'change';
    @Input() itemValue: any;
    @Input() itemPlaceholder: string;
    @Input() color: 'primary' | 'accent' | 'warn';
    @Input() fontSize: string = "16px";
    @Input() label: string;
    @Input() labelLocation: 'left' | 'top' = 'left';
    /** 隐藏必填项标记 */
    @Input() hideRequiredMarker: boolean;
    /**控制占位符提示,有always,never,auto三种 */
    @Input() floatPlaceholder: FloatPlaceholderType;
    /**提示信息文本 */
    @Input() hintLabel?: string;

    constructor( @Optional() @Host() @SkipSelf() private _formBuilder: AbstractFormBuilder) {
    }

    get formBuilder() {
        return this._formBuilder as DynamicFormBuilder;
    }
    ngOnChanges(changes: SimpleChanges): void {

    }
    ngOnInit(): void {

    }

}