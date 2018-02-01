import { Component, AfterViewInit, ElementRef, Inject, ViewChild, ChangeDetectorRef, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { COLUMN_FILTER_DATATOKEN } from './column-filter-data-token';
import { ITreeTableColumn } from '../table-column';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelectionList } from "@angular/material/list";
import { MatSelectionListChange } from "@angular/material/list";
import { MatSelect } from "@angular/material/select";
@Component({
  moduleId: module.id,
  selector: 'adk-column-filter',
  templateUrl: './column-filter.html',
  styleUrls: ['./column-filter.scss'],
  host: {
    '[class.el-hide]': 'false',
    '[class.el-flex-show]': 'false'
  }
})
export class ColumnFilterComponent implements AfterViewInit, OnInit {
  operatorMap: { [key: string]: string[] };
  typeMap: { [key: string]: string };
  ngOnInit(): void {
    this.typeMap = {
      string: 'text',
      number: 'number',
      category: 'select',
      date: 'date',
      boolean: 'checkbox'
    };
    this.operatorMap = {
      string: ['eq', 'neq', 'gt', 'lt', 'startsWith', 'notStartsWith', 'endsWith', 'notEndsWith', 'like', 'notLike', 'between', 'notBetween'],
      number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'],
      category: ['eq', 'neq'],
      date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween', 'sameWeek', 'sameMonth', 'sameYear'],
      boolean: ['eq']
    };

    this.selectedOptions = this.dataOptions;
    this.operators = this.operatorMap['string'].concat(['in', 'notIn']);
  }
  @ViewChild(MatSelectionList) private selectionList: MatSelectionList;
  @ViewChild('operatorSelect') private operatorSelectControl: MatSelect;
  ngAfterViewInit(): void {

    fromEvent(this.hostElRef.nativeElement, 'click')
      .subscribe((e: MouseEvent) => {
        e.stopPropagation();
      });
    let aa = this.operatorSelectControl.overlayDir['_overlay']['_overlayContainer'].getContainerElement();
    fromEvent(aa, 'click')
      .subscribe((e: MouseEvent) => {
        e.stopPropagation();
      });
  }
  constructor(private hostElRef: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(COLUMN_FILTER_DATATOKEN) protected columnDef: ITreeTableColumn) {

  }


  selectAllChecked: boolean = true;
  selectAllIndeterminate: boolean = false;
  dataOptions: string[] = ['Bananas', 'Oranges', 'Apples', 'Strawberries'];
  selectedOptions: string[] = [];
  changeEventCount: Number;
  onSelectedOptionsChange(values: string[]) {
    this.selectedOptions = values;
  }
  onSelectAllChange(event: MatCheckboxChange) {
    if (this.selectionList) {
      if (event.checked) {
        this.selectionList.selectAll();
      }
      else {
        this.selectionList.deselectAll();
      }
    }
    this.selectAllIndeterminate = false;
  }
  onSelectionChange(event: MatSelectionListChange) {
    if (this.selectedOptions.length == 0) {
      this.selectAllChecked = false;
      this.selectAllIndeterminate = false;
    } else if (this.selectedOptions.length > 0 && event.source.options.length != this.selectedOptions.length) {
      this.selectAllIndeterminate = true;
      this.selectAllChecked = false;
    } else {
      this.selectAllIndeterminate = false;
      this.selectAllChecked = true;
    }
  }
  clearFilter(event) {
    console.log(this.selectedOptions, this.item);
  }

  applyFilter(event) {

  }

  operators: string[] = [];
  private defaultEmptyList: any[] = [];
  private operatorsCache: { [key: string]: string[] };
  config;

  get showValueControl2() {
    return ['between', 'notBetween'].some(it => it == this.item.operator);
  }
  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    if (this.config.getOperators) {
      operators = this.config.getOperators(field);
    }
    const fieldObject = this.config.fields[field];
    const type = fieldObject.type;
    if (field && this.operatorMap[type]) {
      operators = this.operatorMap[type];
    }
    if (fieldObject.options) {
      operators = operators.concat(['in', 'notIn']);
    }
    if (fieldObject.nullable) {
      operators = operators.concat(['isNull', 'isNotNull']);
    }
    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }
  getInputType(field: string, operator: string): string {
    // if (this.config.getInputType) {
    //   return this.config.getInputType(field, operator);
    // }
    const type = 'multiselect';   //'category';  //this.config.fields[field].type;
    switch (operator) {
      case 'isNull':
      case 'isNotNull':
        return null;
      case 'in':
      case 'notIn':
        return 'multiselect';
      default:
        return this.typeMap[type];
    }
  }
  getOptions(field: string): Option[] {
    // if (this.config.getOptions) {
    //   return this.config.getOptions(field);
    // }

    return this.test; //this.config.fields[field].options || this.defaultEmptyList;
  }
  test = [{ name: 'abc', value: '123' }, { name: 'def', value: '456' }];
  item: IRule = { key: 'gono', operator: 'in', value: [], value2: 'value2' };
}

export interface IRule {
  nodeType?: string;
  condition?: string;
  rules?: IRule[];
  key?: string;
  field?: string;
  value?: any;
  value2?;
  operator?: string;
  not?: boolean;
  parent?: IRule;
}
export interface RuleSet extends IRule {

}

export interface Rule extends IRule {

}

export interface Option {
  name: string;
  value: any;
}

export interface Field {
  key?: string;
  name: string;
  type: string;
  nullable?: boolean;
  options?: Option[];
}