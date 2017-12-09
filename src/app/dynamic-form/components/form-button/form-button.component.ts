import { Component, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

@Component({
  selector: 'gx-form-button',
  styleUrls: ['form-button.component.scss'],
  template: `
    <div 
      class="dynamic-field form-button"
      [formGroup]="group">
      <button
      [disabled]="config.disabled"
        type="submit">
        {{ config.label }}
      </button>
    </div>
  `
})
export class FormButtonComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  keyBinding: KeyBindingDirective;
  flexItem: FlexItemDirective;
  flexContainer: FlexLayoutDirective;

  constructor(public elementRef: ElementRef) {

  }
}
