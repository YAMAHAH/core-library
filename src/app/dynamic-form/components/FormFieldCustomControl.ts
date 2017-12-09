import { Component } from '@angular/core';
/** @title Form field with custom telephone number input control. */
@Component({
    selector: 'form-field-custom-control-example',
    template: `
    <mat-form-field>
      <my-tel-input placeholder="Phone number" required></my-tel-input>
      <mat-icon matSuffix>phone</mat-icon>
      <mat-hint>Include area code</mat-hint>
    </mat-form-field>
  `
})
export class FormFieldCustomControlExample { }