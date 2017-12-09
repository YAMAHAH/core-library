import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { DynamicFormItemComponent } from './containers/dynamic-form/dynamic-form-item.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { CoreModule } from '@framework-common/shared/shared-module';
import { DynamicFormContainerComponent } from './containers/dynamic-form/dynamic-form-container.component';
import { PanelContainerComponent } from './components/form-container/form-panel.component';
import { DynamicFormBuilder } from '@framework-dynamic-forms/containers/dynamic-form/DynamicFormBuilder';
import { DynamicFormWidgetDirective } from './components/dynamic-field/DynamicFormWidgetDirective';
import { DynamicFormGroupComponent } from './components/form-container/FormGroupComponent';
import { DynamicFormItem } from '@framework-dynamic-forms/containers/dynamic-form/DynamicFormItem';
import { FormValidationRule } from './containers/dynamic-form/FormValidationRule';
import { FormControlType } from './models/form-control-type';
import { MatFormFieldModule, MatInputModule, MatIconModule } from '@angular/material';
import { FormInputEmailComponent } from './components/form-input/form-input-email';
import { FormItemPlaceholder } from './containers/dynamic-form/FormItemPlaceholder';
import { FormItemPrefix } from './containers/dynamic-form/FormItemPrefix';
import { FormItemSuffix } from './containers/dynamic-form/FormItemSuffix';
import { FormItemHint } from '@framework-dynamic-forms/containers/dynamic-form/FormItemHint';
import { MyTelInput } from '@framework-dynamic-forms/components/MyTelInput';
import { FormFieldCustomControlExample } from '@framework-dynamic-forms/components/FormFieldCustomControl';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FormItemFlexLayout } from './containers/dynamic-form/FormItemFlexLayout';
import { FormItemFlexItem } from './containers/dynamic-form/FormItemFlexItem';

const FormControlProviders = [
  { provide: FormControlType, useValue: { type: 'input', value: FormInputComponent }, multi: true },
  { provide: FormControlType, useValue: { type: 'select', value: FormSelectComponent }, multi: true },
  { provide: FormControlType, useValue: { type: 'email', value: FormInputEmailComponent }, multi: true }
]

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [
    DynamicFormBuilder,
    DynamicFormItem,
    DynamicFieldDirective,
    DynamicFormWidgetDirective,
    FormItemHint,
    FormItemPlaceholder,
    FormItemPrefix,
    FormItemSuffix,
    FormItemFlexLayout,
    FormItemFlexItem,
    FormValidationRule,
    DynamicFormComponent,
    FormButtonComponent,
    FormInputComponent,
    FormInputEmailComponent,
    FormSelectComponent,
    FormContainerComponent,
    DynamicFormGroupComponent,
    DynamicFormItemComponent,
    DynamicFormContainerComponent,
    PanelContainerComponent,
    MyTelInput,
    FormFieldCustomControlExample
  ],
  exports: [
    DynamicFormBuilder,
    DynamicFormItem,
    FormValidationRule,
    FormItemHint,
    FormItemPlaceholder,
    FormItemPrefix,
    FormItemSuffix,
    FormItemFlexLayout,
    FormItemFlexItem,
    DynamicFormComponent,
    DynamicFormItemComponent,
    DynamicFormContainerComponent,
    FormFieldCustomControlExample
  ],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormContainerComponent,
    PanelContainerComponent,
    DynamicFormGroupComponent,
    FormInputEmailComponent,
    MyTelInput,
    FormFieldCustomControlExample
  ],
  providers: [
    FormControlProviders, FocusMonitor
  ]
})
export class DynamicFormModule {

  static forRoot(registerControls?: FormControlType[]): ModuleWithProviders {
    return {
      ngModule: DynamicFormModule,
      providers: [FormControlProviders, registerControls]
    };
  }
}
