import { FormGroup } from '@angular/forms';
import { FieldConfig } from './field-config.interface';
import { FormArray } from '@angular/forms/src/model';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { ElementRef } from '@angular/core';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

export interface Field {
  config: FieldConfig;
  group: FormGroup | FormArray;
  elementRef: ElementRef;
  keyBinding: KeyBindingDirective;
  flexItem: FlexItemDirective;
  flexContainer: FlexLayoutDirective;
  contentContainer?:ElementRef;
  focus?: boolean;
  readOnly?: boolean;
  setReadOnly?: (state) => void;
  required?: boolean;
  visible?: boolean;
  setFocus?: () => void;
}
