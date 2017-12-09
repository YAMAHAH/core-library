import { ValidatorFn } from '@angular/forms';
import { ComponentRef, ViewContainerRef, TemplateRef, QueryList } from '@angular/core';
import { Field } from './field.interface';
import { AsyncValidatorFn } from '@angular/forms/src/directives/validators';
import { FloatPlaceholderType } from '@angular/material';
import { FormItemPlaceholder } from '../containers/dynamic-form/FormItemPlaceholder';
import { FormFieldTemplateRefType, FormFieldFlexLayoutType } from './form-field-type';
import { FormItemFlexLayout } from '../containers/dynamic-form/FormItemFlexLayout';
import { FormItemFlexItem } from '../containers/dynamic-form/FormItemFlexItem';

export type controlType = 'group' | 'array' | 'control';

/**
 * 配置创建的类型
 */
export interface FieldConfig {
  disabled?: boolean,
  required?: boolean,
  readOnly?: boolean,
  hidden?: boolean,
  label?: string,
  labelLocation?: 'left' | 'top';
  objectId?: string;
  name: string,
  color?: string,
  fontSize?: string;
  model?: any;
  customErrors?: { [key: string]: any };
  indexName?: string,
  options?: string[],
  dataSource?: any;
  hintLabel?: string;
  hideRequiredMarker?: boolean;
  floatPlaceholder?: FloatPlaceholderType;
  placeholderTempRef?: FormFieldTemplateRefType;
  hintTempRefs?: { align: string, tempRef: TemplateRef<any>, context: any }[];
  suffixTempRefs?: FormFieldTemplateRefType[];
  prefixTempRefs?: FormFieldTemplateRefType[];
  flexItem?: FormItemFlexItem;
  flexContainer?: FormItemFlexLayout;
  placeholder?: string,
  editorType: string,
  controlType?: controlType,
  validation?: ValidatorFn[],
  asyncValidation?: AsyncValidatorFn[],
  updateOn?: 'blur' | 'submit' | 'change',
  value?: any,
  childs?: FieldConfig[],
  parent?: FieldConfig,
  editorOptions?: any,
  componentRef?: ComponentRef<Field>,
  viewContainerRef?: ViewContainerRef
}
