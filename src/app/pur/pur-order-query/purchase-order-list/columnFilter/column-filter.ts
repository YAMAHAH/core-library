import { Component, AfterViewInit, ElementRef, Inject, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { COLUMN_FILTER_ITEMTOKEN } from './column-filter-data-token';
import { ITreeTableColumn } from '../table-column';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelectionList } from "@angular/material/list";
import { MatSelectionListChange } from "@angular/material/list";
import { MatSelect } from "@angular/material/select";
import { IRule, Option } from './column-filter-interface';
import { ColumnFilterItem } from './column-filter-item';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    this._dataOptions = this.columnFilterItem.columnData;

    this.selectedOptions = this.table.contentFilters[this.columnDef.name] || this.dataOptions;
  }

  @ViewChild(MatSelectionList) private selectionList: MatSelectionList;
  @ViewChild('operatorSelect') private operatorSelectControl: MatSelect;
  @ViewChild('search', { read: ElementRef }) private globalFilterEl: ElementRef;
  ngAfterViewInit(): void {

    fromEvent(this.globalFilterEl.nativeElement, 'keyup')
      .pipe(
      debounceTime(150),
      distinctUntilChanged()
      ).subscribe((e) => {
        this.applyFilter(e);
      });
    fromEvent(this.hostElRef.nativeElement, 'click')
      .subscribe((e: MouseEvent) => {
        e.stopPropagation();
      });
    let aa = this.operatorSelectControl.overlayDir['_overlay']['_overlayContainer'].getContainerElement();
    fromEvent(aa, 'click')
      .subscribe((e: MouseEvent) => {
        e.stopPropagation();
      });
    setTimeout(() => this.updateSelectAllState(), 15);
  }
  constructor(private hostElRef: ElementRef,
    @Inject(COLUMN_FILTER_ITEMTOKEN) protected columnFilterItem: ColumnFilterItem) {
  }
  selectAllChecked: boolean = true;
  selectAllIndeterminate: boolean = false;
  _dataOptions: string[] = [];
  get dataOptions(): string[] {
    return this._dataOptions;
  }
  selectedOptions: string[] = [];
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
    this.updateFilter();
  }
  get tableColumnFilters() {
    return this.columnFilterItem.table.filters;
  }
  get table() {
    return this.columnFilterItem.table;
  }
  onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  private updateFilter(contentFilter: boolean = true) {
    let filterMeta;
    if (contentFilter) {
      filterMeta = {
        field: this.columnDef.name,
        value: this.selectedOptions,
        operators: 'in',
        concat: 'and'
      };
    } else {
      filterMeta = {
        field: this.columnDef.name,
        value: (this.isMultipleValue ? [this.filterRule.value, this.filterRule.value2] : this.filterRule.value),
        operators: this.filterRule.operator,
        concat: 'and'
      };
    }
    this.table.filter(filterMeta);
  }
  get isMultipleValue() {
    return ['between', 'notbetween'].some(it => it === this.filterRule.operator);
  }
  updateSelectAllState() {
    if (this.selectedOptions.length == 0) {
      this.selectAllChecked = false;
      this.selectAllIndeterminate = false;
    } else if (this.selectedOptions.length > 0 && this.selectionList.options.length != this.selectedOptions.length) {
      this.selectAllIndeterminate = true;
      this.selectAllChecked = false;
    } else {
      this.selectAllIndeterminate = false;
      this.selectAllChecked = true;
    }
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
    this.updateFilter();
  }
  onFilterValueChange(event) {
    setTimeout(() => this.updateFilter(false), 15);
  }
  clearFilter(event) {
    console.log(this.selectedOptions, this.filterRule);
  }

  searchValue: string;
  applyFilter(event) {
    if (!event.defaultPrevented) {
      if (this.searchValue) {
        let dataType = this.columnDef.dataType;
        this._dataOptions = this.columnFilterItem.columnData.filter(it => {
          if (['number', 'boolean'].some(it => it === dataType))
            return it == +this.searchValue;
          else if (['string', 'date'].some(it => it === dataType))
            return it.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
        });
      } else {
        this._dataOptions = this.columnFilterItem.columnData;
      }
    }
    this.selectedOptions = this.dataOptions;
    this.updateFilter();
    setTimeout(() => this.updateSelectAllState(), 15);
  }

  private defaultEmptyList: any[] = [];
  private operatorsCache: { [key: string]: string[] } = {};

  get columnDef() {
    return this.columnFilterItem.columnDef;
  }
  getOperators(columnName: string): string[] {
    if (this.operatorsCache[columnName]) {
      return this.operatorsCache[columnName];
    }
    let operators = this.defaultEmptyList;
    if (this.columnDef.getOperators) {
      operators = this.columnDef.getOperators(this.columnDef);
    }
    const type = this.columnDef.dataType;
    if (columnName && this.operatorMap[type]) {
      operators = this.operatorMap[type];
    }
    if (this.columnDef.options) {
      operators = operators.concat(['in', 'notIn']);
    }
    if (this.columnDef.nullable) {
      operators = operators.concat(['isNull', 'isNotNull']);
    }
    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[columnName] = operators;
    return operators;
  }
  getInputType(columnName: string, operator: string): string {
    if (this.columnDef.getInputType) {
      return this.columnDef.getInputType(this.columnDef, operator);
    }
    const type = this.columnDef.dataType;
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
  get getOptions(): Option[] {
    if (this.columnDef.getOptions) {
      return this.columnDef.getOptions(this.columnDef);
    }
    return this.columnDef.options || this.defaultEmptyList;
  }

  get filterRule(): IRule {
    if (this.columnFilterItem)
      return this.columnFilterItem.filterRule;
  }

}

