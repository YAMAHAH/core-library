import { Component, OnInit, Input, Injector, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { PageStatusMonitor } from '@framework-services/application/PageStatusMonitor';
import { MatTableDataSource, MatTable, MatSort } from '@angular/material';
import { getMonthDays } from '@untils/dateHelper';
import { getDateRangeDays } from '../../../untils/dateHelper';
import { IWeekDays } from '@framework-models/IWeekDays';
import { IOneDay } from '../../../Models/IWeekDays';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'gx-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.flex-column-container-item]': 'true',
    '[class.el-hide]': '!visible',
    '[class.el-flex-show]': 'visible'
  }
})
export class PurchaseOrderListComponent extends ComponentBase implements OnInit, AfterViewInit {

  @Input() title: string = "采购订单明细查询";
  constructor(protected injector: Injector, protected pageStatusMonitor: PageStatusMonitor) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pageStatusMonitor.idle(data => { console.log('application idle') });
    this.pageStatusMonitor.onEvery(3, () => { console.log('30s') });
    this.pageStatusMonitor.focus(() => { console.log('focus') });
    this.pageStatusMonitor.blur(() => { console.log('blur') });
    this.pageStatusMonitor.wakeup(() => { console.log('wakeup') });

  }
  /**业务逻辑 */
  displayedColumns = [];
  @ViewChild('table') matTable: MatTable<IWeekDays[]>;
  @ViewChild(MatSort) sort: MatSort;
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<IWeekDays>(true, []);;

  columns: ITreeTableColumn[] = [
    { name: 'monday', title: '一', order: 2 },
    { name: 'tuesday', title: '二', order: 3 },
    { name: 'wednesday', title: '三', order: 4 },
    { name: 'thurday', title: '四', order: 5 },
    { name: 'friday', title: '五', order: 6 },
    { name: 'saturday', title: '六', order: 7 },
    { name: 'sunday', title: '日', order: 1 },
  ];
  dataSource = new MatTableDataSource<IWeekDays>();
  ngAfterViewInit(): void {
    let mondayAsFirst: boolean = true;

    if (mondayAsFirst) {
      this.displayedColumns = ['select', 'monday', 'tuesday', 'wednesday', 'thurday', 'friday', 'saturday', 'sunday'];
    } else
      this.displayedColumns = ['select', 'sunday', 'monday', 'tuesday', 'wednesday', 'thurday', 'friday', 'saturday'];

    this.changeDetectorRef.detectChanges();

    let weekDays: IWeekDays[] = getDateRangeDays('2017-9-1', '2017-12-1', mondayAsFirst);//  getMonthDays(new Date(2017, 11, 22));

    this.dataSource = new MatTableDataSource<IWeekDays>(weekDays);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<IWeekDays>(this.allowMultiSelect, this.initialSelection);
    /**树型表格数据 */

    this.treeTableDataSource = new MatTableDataSource<any>(this.dataToDataRow());
    this.treeTableDataSource.filterPredicate = this.secondFilterPredicate;
    fromEvent(this.globalFilterEl.nativeElement, 'keyup')
      .pipe(
      debounceTime(150),
      distinctUntilChanged()
      ).subscribe(() => {
        this.treeTableGlobalFilter();
      });
  }
  activeDay: IOneDay;
  sortingDataAccessor: ((data: IWeekDays, sortHeaderId: string) => string | number) =
    (data: IWeekDays, sortHeaderId: string): string | number => {
      const target = data[sortHeaderId];
      const value = sortHeaderId == 'select' ? target.selected :
        padLeft(target.year, 4) + padLeft(target.month, 2) + padLeft(target.day, 2)
      console.log(value);
      // If the value is a string and only whitespace, return the value.
      // Otherwise +value will convert it to 0.
      if (typeof value === 'string' && !value.trim()) {
        return value;
      }
      return isNaN(+value) ? value : +value;
    }

  masterToggle(event) {
    if (this.isAllSelected()) {
      this.selection.clear();//selection.isSelected(row)
      this.dataSource.data.forEach(row => row.select.selected = false);
    }
    else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.select.selected = true;
      });
    }

  }
  checkBoxChange(event, row: IWeekDays) {
    if (event) {
      this.selection.toggle(row);
      row.select.selected = this.selection.isSelected(row);
    }

  }
  rowClick(event, row) {
    console.log('rowClick');
  }

  cellClick(event: Event, element) {
    event.stopPropagation();
    if (this.activeDay != element) {
      if (this.activeDay) this.activeDay.selected = false;
      this.activeDay = element;
      this.activeDay.selected = true;
    }
  }
  cellStyle(cell) {
    let style = {};
    if (!cell.isCurrentMonth) {
      style['color'] = "gray"
    }
    return style;
  }
  applyFilter(event) {
    let filterValue = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  filterPredicate: ((data: IWeekDays, filter: string) => boolean) =
    (data: IWeekDays, filter: string): boolean => {
      const accumulator = (currentTerm, key) => {
        return currentTerm + (key == 'select' ? data[key].selected.toString() : data[key].day.toString());
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    };
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  /**树型结构TABLE */
  @ViewChild('globalFilter', { read: ElementRef }) globalFilterEl: ElementRef;
  idKey: string = "id";
  parentIdKey: string = "parentid";
  treeTableDataSource = new MatTableDataSource<ITreeTableRow<any>>();
  treeTableData: ITreeTableData[] = [
    { id: 1, ord: 1, level: 0, gono: 'B001-41AGAGF03', goname: '吊扇螺丝包', gg: 'A76彩+W44 环保蓝锌5F(PE袋不印字', dw: '包' },
    { id: 2, ord: 2, level: 1, gono: 'R001A765FZCE', goname: '叶架螺丝包', gg: '大扁M5*7MM*15支+纸M5.环保蓝锌', dw: '包', parentid: 1 },
    { id: 3, ord: 3, level: 2, gono: 'P010101053ZCE', goname: '大扁±(三价铬)', gg: 'M5-0.8*7MM蓝锌(环保).￠10', dw: 'PC', parentid: 2 },
    { id: 11, ord: 4, level: 3, gono: 'P010101053', goname: '大扁±', gg: 'M5-0.8*7MM黑身.￠10', dw: 'PC', parentid: 3 },
    { id: 4, ord: 5, level: 2, gono: 'P010300594SGE', goname: '圆纸华司', gg: '圆头M4*19MM*2￠5*14*1.5T 灰色(环保)', dw: 'PC', parentid: 2 },
    { id: 5, ord: 6, level: 2, gono: 'P560140065GRE', goname: '塑胶袋(全新料)', gg: '60*60*0.04MM(环保)浅绿色', dw: 'PC', parentid: 2 },
    { id: 6, ord: 7, level: 1, gono: 'R001W44ZCE', goname: '马达叶架螺丝包', gg: '圆头M4*19MM*2支.环保蓝锌', dw: '包', parentid: 1 },
    { id: 7, ord: 8, level: 2, gono: 'P010102156ZCEH', goname: '圆头⊕-JIS铁板牙A热(三价铬)', gg: 'M4-16*19MM蓝锌(环保)尖尾加硬38-42度.￠6.6', dw: 'PC', parentid: 6 },
    { id: 8, ord: 9, level: 3, gono: 'P010102156H', goname: '圆头⊕-JIS铁板牙A热', gg: 'M4-16*19MM黑身尖尾加硬38-42度.￠6.6', dw: 'PC', parentid: 7 },
    { id: 9, ord: 10, level: 4, gono: 'P010102156', goname: '圆头⊕-JIS铁板牙A', gg: 'M4-16*19MM黑身尖尾.￠6.6', dw: 'PC', parentid: 8 },
    { id: 10, ord: 11, level: 2, gono: 'P560140065GRE', goname: '塑胶袋(全新料)', gg: '60*60*0.04MM(环保)浅绿色', dw: 'PC', parentid: 6 },

    { id: 11, ord: 8, level: 1, gono: 'P560140004GRE', goname: '塑胶袋(全新料)', gg: '100*100*0.04MM(环保)浅绿色', dw: 'PC', parentid: 1 }
  ];
  treeTableColumns: ITreeTableColumn[] = [
    { name: 'gono', title: '编码', width: 200 },
    { name: 'goname', title: '名称', width: 200 },
    { name: 'gg', title: '规格' },
    { name: 'dw', title: '单位', width: 30 },
    { name: 'level', title: '层次', width: 30 },
    { name: 'ord', title: '序号', width: 30 },
  ];
  treeTableDisplayedColumns = ['lineNo', 'gono', 'goname', 'gg', 'dw', 'ord', 'level'];
  /**是否第一列 */
  firstColumn(columnName) {
    return this.treeTableDisplayedColumns[1] == columnName;
  }
  collapseStyleClass(row) {
    return {
      'fa-minus-square-o': !this.isLeaf(row) && !row.collapsed, //fa-chevron-down
      'fa-plus-square-o': !this.isLeaf(row) && row.collapsed //fa-chevron-up
    }
  }
  private getStyleValue(value) {
    if (!value) return undefined;
    value = value.toString().trim();
    if (value.endsWith('px') ||
      value.endsWith('em') ||
      value.endsWith('rem') ||
      value.endsWith('%'))
      return value;
    else return value + 'px';
  }
  rowCellStyle(dataRow: ITreeTableRow<any>, dataColumn: ITreeTableColumn) {
    let style = {};
    let colWidth = this.getStyleValue(dataColumn.width);
    if (dataColumn.width)
      style['flex'] = '0 0 ' + colWidth;
    return style;
  }
  isLeaf(rowData) {
    let leaf = this.treeTableDataSource.data.some(row => row.data.parentid == rowData.data.id);
    return !leaf;
  }
  collapseClick(event, dataRow: ITreeTableRow<any>) {
    if (!this.isLeaf(dataRow)) {
      if (this.collapsedDatas.length == 0) {
        if (this.treeTableDataSource.filter)
          this.collapsedDatas = this.treeTableDataSource.filteredData;
        else
          this.collapsedDatas = this.treeTableDataSource.data;
      }

      dataRow.collapsed = !dataRow.collapsed;
      let visibleValue = dataRow.collapsed ? false : true;
      this.expanedChildRow(dataRow, childRow => {
        childRow.visible = visibleValue;
      }, [dataRow]);
      this.treeTableDataSource.filter = "true";
    }
  }
  collapsedDatas: ITreeTableRow<any>[] = [];
  expanedChildRow(childRow: ITreeTableRow<any>, action: (child: ITreeTableRow<any>) => void,
    excludeRows: ITreeTableRow<any>[] = [], expanedLevel: number = -1) {

    if (!excludeRows.contains(childRow)) action(childRow);
    let childRows;
    if (this.collapsedDatas.length > 0)
      childRows = this.collapsedDatas;
    else if (this.treeTableDataSource.filter)
      childRows = this.treeTableDataSource.filteredData;
    else childRows = this.treeTableDataSource.data;

    childRows = childRows.filter(rowData => rowData.data[this.parentIdKey] == childRow.data[this.idKey]);

    childRows.forEach(child => {
      if (child.data.level <= expanedLevel || expanedLevel == -1)
        if (excludeRows.contains(childRow) || !childRow.collapsed) {
          this.expanedChildRow(child, action);
        }
    });
  }
  serachParentRow(row: ITreeTableRow<any>, action: (child: ITreeTableRow<any>) => void,
    excludeRows: ITreeTableRow<any>[] = []) {

    if (excludeRows.notContains(row)) {
      action(row);
      excludeRows.push(row);
    }
    let parentRow = this.treeTableDataSource.data
      .find(rowData => rowData.data[this.idKey] == row.data[this.parentIdKey]);
    if (parentRow) {
      if (excludeRows.notContains(parentRow))
        this.serachParentRow(parentRow, action, excludeRows);
    }
  }
  rowWhen(index: number, rowData: ITreeTableRow<any>): boolean {
    return rowData.visible == undefined || rowData.visible;
  }
  globalFilter() {

  }
  columnFilter(columnFilters) {

  }
  dataToDataRow() {
    let dataRows: ITreeTableRow<ITreeTableData>[] = [];
    this.treeTableData.forEach(data => {
      dataRows.push({
        collapsed: false,
        visible: true,
        data: data,
        table: null
      });
    });
    return dataRows;
  }
  secondFilterPredicate(dataRow: ITreeTableRow<any>, filter: string): boolean {
    return dataRow.visible;
  };
  firstFilterPredicate(dataRow: ITreeTableRow<any>, filter: string): boolean {
    const accumulator = (currentTerm, key) => {
      return currentTerm + dataRow.data[key].toString();
    };
    const dataStr = Object.keys(dataRow.data).reduce(accumulator, '').toLowerCase();
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) != -1;
  };
  resetCollapseState() {
    this.treeTableDataSource.data.forEach(dataRow => {
      dataRow.collapsed = false;
    });
  }
  treeTableGlobalFilter() {
    this.resetCollapseState();
    let filterDatas = this.treeTableDataSource.data.filter(dataRow => {
      dataRow.visible = false;
      return this.firstFilterPredicate(dataRow, this.globalFilterEl.nativeElement.value);
    });
    filterDatas.forEach(childRow => {
      this.serachParentRow(childRow, dataRow => {
        dataRow.visible = true;
      }, []);
    });
    this.treeTableDataSource.filter = "true";
    setTimeout(() => this.collapsedDatas = this.treeTableDataSource.filteredData, 15);
  }
  /** 表结构 */
  rows: ITreeTableRow<any>[] = []; //表格行
  dataColumns: ITreeTableColumn[] = [];
  currentCell: ITreeTableRowCell;        //获取当前单元格
  currentRow;        //获取包含当前单元格的行
  selectedRows;     // 获取用户选定行的集合
  dataSources; //数据源   
  @Output() currentCellChanged: EventEmitter<any> = new EventEmitter<any>(); //当选择单元格时发生
  @Output() cellContentClick: EventEmitter<any> = new EventEmitter<any>();   //当点击某个单元格时发生 
  @Output() cellBeginEdit: EventEmitter<any> = new EventEmitter<any>();   //当某个单元格开始编辑时发生
  //创建列
  createColumn() {

  }
  removeColumn() {

  }
  /**创建行*/
  createRow() {

  }
  /**删除行 */
  removeRow() {

  }
  //筛选行
  select() {

  }
  //排序
  tableSort() {

  }


}
export interface ITreeTableColumn {
  name: string;
  dataType?: string;
  title: string;
  defaultValue?: any;
  readOnly?: boolean;
  visible?: boolean;
  resizable?: boolean;
  selected?: boolean;
  allowNull?: boolean;
  order?: number;
  width?;
  algin?; // 水平 垂直
  defaultCellStyle?;
  headerCell?;
  headerText?;
}

interface ITreeTableRow<T> {
  collapsed?: boolean;
  visible?: boolean;
  level?: number;
  data?: T;
  table?;
}
interface ITreeTableRowCell {
  columnIndex?: number;
  rowIndex?: number;
  readOnly?: boolean;
  value?;
  valueType?;
  style?;
  contentBounds?;
  formattedValue?;
  selected?: boolean;
  visible?: boolean;
  toolTipText?: string;
  tag?;
}

interface ITreeTableData {
  ord?;
  level?;
  gono?;
  goname?;
  gg?;
  dw?;
  parent?;
  id?;
  parentid?;
}

// function padLeft() {  
//   var tbl = [];  
//   return function(num, n) {  
//     var len = n-num.toString().length;  
//     if (len <= 0) return num;  
//     if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');  
//     return tbl[len] + num;  
//   }  
// }();

function padLeft(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num.toString();
}



