import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormContainerComponent } from '../form-container/form-container.component';

const components: { [type: string]: Type<Field> } = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent,
  form: FormContainerComponent

};

@Directive({
  selector: '[gxDynamicField]'
})
export class DynamicFieldDirective implements OnChanges, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  group: FormGroup;

  component: ComponentRef<Field>;
  elementRef: ElementRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
    this.createFormControls();
  }

  private createFormControls() {
    if (!components[this.config.editorType]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.editorType}).
        Supported types: ${supportedTypes}`
      );
    }
    let viewRef = this.config.viewContainerRef || this.container;
    const component = this.resolver.resolveComponentFactory<Field>(components[this.config.editorType]);
    this.component = viewRef.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    let events = new Map<string, string>();
    component.outputs.map(e => events.set(e.templateName, e.propName));
    let props = new Map<string, string>();
    component.inputs.map(e => props.set(e.templateName, e.propName));
    let options = this.config.editorOptions;
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const val = options[key];
        if (events.has(key)) {
          this.component.instance[events.get(key)].subscribe(val);
        }
        else if (props.has(key)) {
          this.component.instance[props.get(key)] = val;
        }
      }
    }
    this.config.componentRef = this.component;
  }

  private createFormControls2(config: FieldConfig) {
    let viewRef = config.viewContainerRef || this.container;
    const component = this.resolver.resolveComponentFactory<Field>(components[config.editorType]);
    let componentRef = viewRef.createComponent(component);
    componentRef.instance.config = config;
    componentRef.instance.group = this.group;

    let events = new Map<string, string>();
    component.outputs.map(e => events.set(e.templateName, e.propName));
    let props = new Map<string, string>();
    component.inputs.map(e => props.set(e.templateName, e.propName));
    let options = this.config.editorOptions;

    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const val = options[key];
        if (events.has(key)) {
          componentRef.instance[events.get(key)].subscribe(val);
        }
        else if (props.has(key)) {
          componentRef.instance[props.get(key)] = val;
        }
      }
    }

    config.componentRef = componentRef;

    config.childs.forEach(config => {
      this.createFormControls2(config);
    });
  }
}
