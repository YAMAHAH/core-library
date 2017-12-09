import { Component, ViewContainerRef, EventEmitter, Input, Output, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FormFieldControl } from '../form-field-control';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';

type treeNodeType = { id: string, name: string, level: number, children: treeNodeType[] };

@Component({
  selector: 'gx-form-input',
  styleUrls: ['form-input.component.scss'],
  template: `
    <div class="dynamic-field form-input" [formGroup]="group">
      <label>{{ config.label }}</label>
      <input gxBorder gxBorderInfo gxWidth75 gxWidth25
        #textInputControl
        (click)="onClick($event)" 
        type="text"
        [attr.placeholder]="inputPlaceholder"
        [formControlName]="config.indexName || config.name">
    </div>
  `
})
export class FormInputComponent extends FormFieldControl implements Field {

  controlType: string = 'input';
  readOnly: boolean;
  required: boolean;
  visible: boolean;
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

  constructor(public elementRef: ElementRef) {
    super();
  }
  @Input('placeholder') inputPlaceholder: string;
  @Output('onClick') inputClick: EventEmitter<any> = new EventEmitter<any>();

  onClick(event) {
    this.inputClick.emit(event);
    let category = [
      {
        "id": '1',
        "parentId": '0',
        "name": "机器学习算法"
      },
      {
        "id": '2',
        "parentId": '1',
        "name": "逻辑回归"
      },
      {
        "id": '3',
        "parentId": '0',
        "name": "数据预处理"
      },
      {
        "id": '4',
        "parentId": '0',
        "name": "脚本"
      },
      {
        "id": '5',
        "parentId": '3',
        "name": "文本处理"
      }];


    let dataNodes: DataNode[] = [];

    let createTreeNode = (nodeData, level) => {
      let node = new DataNode(nodeData.id, nodeData.name, level);
      dataNodes.push(node);
      return node;
    }
    category.forEach(c => {
      let node = dataNodes.find(n => n.id === c.id);
      let parent = dataNodes.find(n => n.id === c.parentId);
      let level = parent ? parent.level + 1 : 0;

      if (!parent && c.parentId && c.parentId != '0') {
        let parentData = category.find(c => c.id === c.parentId);
        if (parentData)
          parent = createTreeNode(parentData, 0);
      }

      if (!node)
        node = createTreeNode(c, level);
      else
        node.level = level;

      parent && parent.childrens.push(node);
    });
    console.log(dataNodes.filter(n => n.level === 0));
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
}

export class DataNode {
  constructor(public id: string, public name: string, public level: number) {

  }
  childrens: DataNode[] = [];
}