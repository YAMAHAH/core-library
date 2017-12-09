import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FormFieldControl } from '../form-field-control';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

@Component({
  selector: 'gx-form-select',
  styleUrls: ['form-select.component.scss'],
  template: `
    <div 
      class="dynamic-field form-select"
      [formGroup]="group">
      <label>{{ config.label }}</label>
      <select #selectControl
        (mousemove)="onMousemoveHandler($event,selectControl)" 
        (mouseout)="onMouseoutHandler($event,selectControl)" 
        (focus)="onFocusHandler($event,selectControl)" 
        [formControlName]="config.indexName || config.name">
          <option [disabled]="readonly" value="">{{ config.placeholder }}</option>
          <option  [disabled]="readonly" [value] ="option" *ngFor="let option of config.options">
          {{ option }}
          </option>
      </select>
    </div>
  `
})
export class FormSelectComponent extends FormFieldControl implements Field {
  controlType: string = 'select';
  @ViewChild('selectControl', { read: ElementRef }) selectControl: ElementRef;
  config: FieldConfig;
  group: FormGroup;
  keyBinding: KeyBindingDirective;
  
  flexItem: FlexItemDirective;
  flexContainer: FlexLayoutDirective;
  setFocus(): void {
    this.focus = true;
  }
  setReadOnly(state): void {
    this.readonly = state;
  }
  onMousemoveHandler(event, target) {
    let abc: Event
    if (this.readonly)
      event.stopPropagation();
    if (target.setCapture) target.setCapture();
  }
  onMouseoutHandler(event: Event, target) {
    if (this.readonly)
      event.stopPropagation();
    if (target.releaseCapture) target.releaseCapture();
  }
  onFocusHandler(event, target) {
    if (this.readonly)
      target.blur();
  }

  private _readOnly: boolean;
  @Input() get readonly() {
    return this._readOnly;
  }
  set readonly(value) {
    this._readOnly = value;
  }

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
  constructor(public elementRef: ElementRef) {
    super();
  }
}