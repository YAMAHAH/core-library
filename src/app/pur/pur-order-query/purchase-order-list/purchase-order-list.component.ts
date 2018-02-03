import { Component, OnInit, Input, Injector, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Renderer2, ViewChildren, QueryList, AfterViewChecked, DoCheck, AfterContentChecked } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { PageStatusMonitor } from '@framework-services/application/PageStatusMonitor';
import { MatTableDataSource, MatTable, MatSort, MatHeaderCell } from '@angular/material';
import { getMonthDays } from '@untils/dateHelper';
import { getDateRangeDays } from '../../../untils/dateHelper';
import { IWeekDays } from '@framework-models/IWeekDays';
import { IOneDay } from '../../../Models/IWeekDays';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { debounceTime, distinctUntilChanged, delay, filter } from 'rxjs/operators';
import { defer } from 'rxjs/observable/defer';
import { AdkDataSource } from './AdkDataSource';
import { AdkSort } from './sort/sort';
import { startWith, catchError, switchMap, map } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { MatPaginator } from '@angular/material/paginator';
import { empty } from 'rxjs/observable/empty';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ColumnFilterComponent } from './columnFilter/column-filter';
import { Subscription } from 'rxjs/Subscription';
import { DomHandler } from '@framework-common/dom/domhandler';
import { ITreeTableColumn } from './table-column';
import { COLUMN_FILTER_ITEMTOKEN } from './columnFilter/column-filter-data-token';
import { ColumnFilterItem } from './columnFilter/column-filter-item';
import { IRule } from './columnFilter/column-filter-interface';
import { ExpressionOperators } from "@untils/ExpressionOperators";
import { Expression } from "@untils/ExpressionBuilder";
import { LazyLoadEventArgs, columnSortMeta } from './LazyLoadEventArgs';
import { Subscribable } from 'rxjs/Observable';

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
  constructor(protected injector: Injector,
    private renderer: Renderer2,
    private overlay: Overlay,
    private domHandler: DomHandler,
    protected pageStatusMonitor: PageStatusMonitor) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.pageStatusMonitor.idle(data => { console.log('application idle') });
    // this.pageStatusMonitor.onEvery(3, () => { console.log('30s') });
    // this.pageStatusMonitor.focus(() => { console.log('focus') });
    // this.pageStatusMonitor.blur(() => { console.log('blur') });
    // this.pageStatusMonitor.wakeup(() => { console.log('wakeup') });

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
    // this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    // this.dataSource.filterPredicate = this.filterPredicate;
    // this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<IWeekDays>(this.allowMultiSelect, this.initialSelection);
    /**树型表格数据 */ //MatTableDataSource
    this.treeTableDataSource = new AdkDataSource<any>(this.dataToDataRow());
    this.treeTableDataSource.sortingDataAccessor = this.treeTableSortingDataAccessor;
    this.treeTableDataSource.sort = this.adkSort;
    this.treeTableDataSource.paginator = this.paginator;
    this.treeTableDataSource.filterPredicate = this.secondFilterPredicate;
    this.listenLazyLoad();

    this.fixedTableHeaderRow();
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
  treeTableDataSource = new AdkDataSource<ITreeTableRow>();
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
    {
      key: 'rowHeader',
      name: 'rowHeader', title: '', width: 25,
      resizable: false, allowColumnFilter: false,
      expressionFunc: (row, index) => index + 1,
      defaultCellStyle: {
        'justify-content': 'center',
        'background-color': '#f3f3f3'

      }
    },
    { key: 'gono', dataType: 'string', name: 'gono', allowColumnFilter: true, title: '编码', width: 200 },
    { key: 'goname', dataType: 'string', name: 'goname', allowColumnFilter: true, title: '名称', width: 200 },
    { key: 'gg', dataType: 'string', name: 'gg', allowColumnFilter: true, title: '规格' },
    { key: 'dw', dataType: 'string', name: 'dw', allowColumnFilter: true, title: '单位', width: 65, defaultCellStyle: { 'justify-content': 'center' } },
    { key: 'level', dataType: 'number', name: 'level', allowColumnFilter: true, title: '层次', width: 65, defaultCellStyle: { 'justify-content': 'center' } },
    { key: 'ord', dataType: 'number', name: 'ord', allowColumnFilter: true, title: '序号', width: 65, defaultCellStyle: { 'justify-content': 'center' } },
  ];
  treeTableDisplayedColumns = ['rowHeader', 'gono', 'goname', 'gg', 'dw', 'ord', 'level'];
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
  private copyStyleValue(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  rowCellStyle(dataRow: ITreeTableRow, dataColumn: ITreeTableColumn) {
    let style = {};
    let colWidth = this.getStyleValue(dataColumn.width);
    if (dataColumn) this.copyStyleValue(style, dataColumn.defaultCellStyle);
    //获取单元格
    let cell = this.getRowCell(dataRow, dataColumn);
    if (cell) this.copyStyleValue(style, cell.style);
    if (dataColumn.width)
      style['flex'] = '0 0 ' + colWidth;

    return style;
  }
  rowHeaderCellStyle(dataRow: ITreeTableRow, dataColumn: ITreeTableColumn) {
    let style = {};
    let colWidth = this.getStyleValue(dataColumn.width);
    if (dataColumn) this.copyStyleValue(style, dataColumn.headerCellStyle);

    if (dataColumn.width)
      style['flex'] = '0 0 ' + colWidth;

    return style;
  }
  get fixedHeaderStyle() {
    let style = {};
    if (this.fixHeaderRow && this.treeTableContainer) {
      let containerEl: HTMLElement = this.treeTableContainer.nativeElement;
      style['width'] = this.getStyleValue(containerEl.clientWidth);
      style['height'] = this.getStyleValue(this.matHeaderRowElRef.offsetHeight);
      style['left'] = this.getStyleValue(containerEl.offsetLeft);
      style['top'] = this.getStyleValue(containerEl.offsetTop);
      style['z-index'] = 100;
    }
    return style;
  }

  get headerRowStyle() {
    let style = {};
    if (this.columnHeadersVisible == false) {
      style['display'] = 'none';
    }
    if (this.fixHeaderRow) {
      style['width'] = this.getStyleValue(this.fixHeaderContainerElRef.offsetWidth);
    }
    return style;
  }
  isLeaf(rowData) {
    let leaf = this.treeTableDataSource.data.some(row => row.dataBoundItem.parentid == rowData.dataBoundItem.id);
    return !leaf;
  }
  collapseClick(event, dataRow: ITreeTableRow) {
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
    console.log(dataRow);
  }
  collapsedDatas: ITreeTableRow[] = [];
  expanedChildRow(childRow: ITreeTableRow, action: (child: ITreeTableRow) => void,
    excludeRows: ITreeTableRow[] = [], expanedLevel: number = -1) {

    if (!excludeRows.contains(childRow)) action(childRow);
    let childRows;
    if (this.collapsedDatas.length > 0)
      childRows = this.collapsedDatas;
    else if (this.treeTableDataSource.filter)
      childRows = this.treeTableDataSource.filteredData;
    else childRows = this.treeTableDataSource.data;

    childRows = childRows.filter(rowData => rowData.dataBoundItem[this.parentIdKey] == childRow.dataBoundItem[this.idKey]);

    childRows.forEach(child => {
      if (child.dataBoundItem.level <= expanedLevel || expanedLevel == -1)
        if (excludeRows.contains(childRow) || !childRow.collapsed) {
          this.expanedChildRow(child, action);
        }
    });
  }
  serachParentRow(row: ITreeTableRow, action: (child: ITreeTableRow) => void,
    excludeRows: ITreeTableRow[] = []) {

    if (excludeRows.notContains(row)) {
      action(row);
      excludeRows.push(row);
    }
    let parentRow = this.treeTableDataSource.data
      .find(rowData => rowData.dataBoundItem[this.idKey] == row.dataBoundItem[this.parentIdKey]);
    if (parentRow) {
      if (excludeRows.notContains(parentRow))
        this.serachParentRow(parentRow, action, excludeRows);
    }
  }
  rowWhen(index: number, rowData: ITreeTableRow): boolean {
    return rowData.visible == undefined || rowData.visible;
  }

  private getCellRowIndex(row) {
    return this.rows.findIndex(r => r == row);
  }
  private getCellColumnIndex(columnName) {
    return this.treeTableDisplayedColumns.indexOf(columnName);
  }
  dataToDataRow() {
    this.rows = [];
    let self = this;
    this.treeTableData.forEach(data => {

      let row: ITreeTableRow = {
        get rowNo() { return self.rows.findIndex(r => r == row) + 1; },
        collapsed: false,
        visible: true,
        dataBoundItem: data,
        cells: [],
        table: null
      };

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const cellValue = data[key];

          let rowCell: ITreeTableRowCell = {
            get columnIndex() { return self.getCellColumnIndex(key); },
            get rowIndex() { return self.rows.findIndex(r => r == row) },
            columnName: key,
            visible: true,
            selected: false,
            value: cellValue,
            readOnly: false,
            valueType: 'string',
            toolTipText: 'cell',
            tag: {},
            style: {},
            formattedValue: cellValue,
            contentBounds: null
          };
          row.cells.push(rowCell);
        };
      }

      this.rows.push(row);
    });
    return this.rows;
  }
  secondFilterPredicate(dataRow: ITreeTableRow, filter: string): boolean {
    return dataRow.visible;
  };
  firstFilterPredicate(dataRow: ITreeTableRow, filter: string): boolean {
    const accumulator = (currentTerm, key) => {
      return currentTerm + dataRow.dataBoundItem[key].toString();
    };
    const dataStr = Object.keys(dataRow.dataBoundItem).reduce(accumulator, '').toLowerCase();
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) != -1 && this._filterPredicate(dataRow, filter);
  };
  resetCollapseState() {
    this.treeTableDataSource.data.forEach(dataRow => {
      dataRow.collapsed = false;
    });
  }
  treeTableGlobalFilter() {
    let predicateFunc = this.genFilterExpression(this.globalFilterEl.nativeElement.value);
    this.resetCollapseState();
    let filterDatas = this.treeTableDataSource.data.filter(dataRow => {
      dataRow.visible = false;
      return predicateFunc(dataRow.dataBoundItem);
      // return this.firstFilterPredicate(dataRow, this.globalFilterEl.nativeElement.value);
    });
    filterDatas.forEach(childRow => {
      this.serachParentRow(childRow, dataRow => {
        dataRow.visible = true;
      }, []);
    });
    this.treeTableDataSource.filter = "true";
    setTimeout(() => this.collapsedDatas = this.treeTableDataSource.filteredData, 15);
  }
  resolveFieldData(data, field: string) {
    if (data && field) {
      if (field.indexOf('.') == -1) {
        return data[field];
      }
      else {
        let fields: string[] = field.split('.');
        let value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    }
    else {
      return null;
    }
  }
  /**
   * resize column
   */
  documentColumnResizeListener;
  documentColumnResizeEndListener;
  @ViewChild('resizerHelper', { read: ElementRef }) resizerHelper: ElementRef;
  @ViewChild('treeTable', { read: ElementRef }) treeTableContainer: ElementRef;
  columnResizing: boolean;
  resizableColumns: boolean = true;
  resizeColumn: ITreeTableColumn;
  lastResizerHelperX;
  columnResizeMode: 'fit' | 'expand' | 'none' = 'fit';
  @Output() onColResize: EventEmitter<any> = new EventEmitter<any>();
  initResizableColumns() {
    // this.tbody = this.domHandler.findSingle(this.el.nativeElement, 'tbody.ui-datatable-data');
    //this.fixColumnWidths();

    this.documentColumnResizeListener = this.renderer.listen('body', 'mousemove', (event) => {
      if (this.columnResizing) {
        this.onColumnResize(event);
      }
    });

    this.documentColumnResizeEndListener = this.renderer.listen('body', 'mouseup', (event) => {
      if (this.columnResizing) {
        this.columnResizing = false;
        this.onColumnResizeEnd(event);
      }
    });
  }

  initColumnResize(event, column: ITreeTableColumn) {
    event.stopPropagation();
    event.preventDefault();
    this.initResizableColumns();
    let container = this.treeTableContainer.nativeElement;
    let containerLeft = this.getOffset(container).left;
    this.resizeColumn = column;
    this.columnResizing = true;
    this.lastResizerHelperX = (event.pageX - containerLeft);
  }
  private getOffset(el) {
    let x = el.offsetLeft;
    let y = el.offsetTop;

    while (el = el.offsetParent) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }

    return { left: x, top: y };
  }
  onColumnResize(event) {
    let container = this.treeTableContainer.nativeElement;
    let containerLeft = this.getOffset(container).left;
    this.renderer.addClass(container, 'ui-unselectable-text');
    this.resizerHelper.nativeElement.style.height = container.offsetHeight + 'px';
    this.resizerHelper.nativeElement.style.top = container.offsetTop + 'px';
    if (event.pageX > containerLeft && event.pageX < (containerLeft + container.offsetWidth)) {
      this.resizerHelper.nativeElement.style.left = (event.pageX - containerLeft) + 'px';
    }
    this.resizerHelper.nativeElement.style.display = 'block';
  }

  private getColumnElementRef(columnName: string) {
    let headerColumnName = 'mat-column-' + columnName;
    let headerColumnElRef: HTMLElement = this.headerCells
      .find(cell => cell.nativeElement.classList.contains(headerColumnName))
      .nativeElement;
    return headerColumnElRef;

  }
  onColumnResizeEnd(event) {
    let delta = this.resizerHelper.nativeElement.offsetLeft - this.lastResizerHelperX;
    let columnWidth = this.getColumnElementRef(this.resizeColumn.name).offsetWidth;
    let newColumnWidth = columnWidth + delta;
    let minWidth = this.resizeColumn.minWidth && this.resizeColumn.minWidth || 15;
    if (columnWidth + delta > parseInt(minWidth)) {
      if (this.columnResizeMode === 'fit') {
        // let nextColumn = this.resizeColumn.nextElementSibling;
        // let nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15) { //&& nextColumnWidth > 15
          this.resizeColumn.width = newColumnWidth;
          // if (nextColumn) {
          //   nextColumn.style.width = nextColumnWidth + 'px';
          // }

          // if (this.scrollable) {
          //   let colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
          //   let resizeColumnIndex = this.domHandler.index(this.resizeColumn);
          //   colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';

          //   if (nextColumn) {
          //     colGroup.children[resizeColumnIndex + 1].style.width = nextColumnWidth + 'px';
          //   }
          // }
        }
      }
      else if (this.columnResizeMode === 'expand') {
        // this.tbody.parentElement.style.width = this.tbody.parentElement.offsetWidth + delta + 'px';
        // this.resizeColumn.style.width = newColumnWidth + 'px';
        // let containerWidth = this.tbody.parentElement.style.width;

        // if (this.scrollable) {
        //   this.scrollBarWidth = this.scrollBarWidth || this.domHandler.calculateScrollbarWidth();
        //   this.el.nativeElement.children[0].style.width = parseFloat(containerWidth) + this.scrollBarWidth + 'px';
        //   let colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
        //   let resizeColumnIndex = this.domHandler.index(this.resizeColumn);
        //   colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';
        // }
        // else {
        //   this.el.nativeElement.children[0].style.width = containerWidth;
        // }
      }

      this.onColResize.emit({
        element: this.resizeColumn,
        delta: delta
      });
      if (this.documentColumnResizeListener) this.documentColumnResizeEndListener();
      if (this.documentColumnResizeEndListener) this.documentColumnResizeEndListener();
    }

    this.resizerHelper.nativeElement.style.display = 'none';
    this.resizeColumn = null;
    this.renderer.removeClass(this.treeTableContainer.nativeElement, 'ui-unselectable-text');
  }

  fixColumnWidths() {
    let columns = []; // this.domHandler.find(this.el.nativeElement, 'th.ui-resizable-column');

    for (let col of columns) {
      col.style.width = col.offsetWidth + 'px';
    }
  }
  onHeaderKeydown(event: any, column: ITreeTableColumn) {
    if (event.keyCode == 13) {
      // this.sort(event, column);
      event.preventDefault();
    }
  }

  onHeaderMousedown(event, column: ITreeTableColumn) {
    if (this.reorderableColumns) {
      if (event.target.nodeName !== 'INPUT') {
        column.draggable = true;
      } else if (event.target.nodeName === 'INPUT') {
        column.draggable = false;
      }
    }
  }
  draggedColumn: ITreeTableColumn;
  @Input() reorderableColumns: boolean = true;
  @Output() onColReorder: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('reorderIndicatorUp', { read: ElementRef }) reorderIndicatorUp: ElementRef;
  @ViewChild('reorderIndicatorDown', { read: ElementRef }) reorderIndicatorDown: ElementRef;
  @ViewChildren(MatHeaderCell, { read: ElementRef }) headerCells: QueryList<ElementRef>;

  onColumnDragStart(event, column) {
    if (this.columnResizing) {
      event.preventDefault();
      return;
    }
    this.renderer.addClass(this.treeTableContainer.nativeElement, 'ui-unselectable-text');
    this.draggedColumn = column; //this.findParentHeader(event.target);
    event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
    //   this.zone.runOutsideAngular(() => {
    //     window.document.addEventListener('dragover', this.onColumnDragover.bind(this));
    //     this.renderer.listen(document,'dragOver',this.onColumnDragover)
    // });
  }
  dropPosition: number;
  onColumnDragover(event, column: ITreeTableColumn) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      let iconWidth = this.getHiddenElementOuterWidth(this.reorderIndicatorUp.nativeElement);
      let iconHeight = this.getHiddenElementOuterHeight(this.reorderIndicatorUp.nativeElement);

      let dropHeader: HTMLElement = this.getColumnElementRef(column.name);


      let container = this.treeTableContainer.nativeElement;
      let containerOffset = this.getOffset(container);
      let dropHeaderOffset = this.getOffset(dropHeader);

      if (this.draggedColumn != column) {
        let targetLeft = dropHeaderOffset.left - containerOffset.left;
        let targetTop = containerOffset.top - dropHeaderOffset.top;
        let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
        this.reorderIndicatorUp.nativeElement.style.top = container.offsetTop + dropHeader.offsetHeight + 'px';
        //dropHeaderOffset.top - containerOffset.top + (iconHeight - 1) + 'px';
        this.reorderIndicatorDown.nativeElement.style.top = container.offsetTop - iconHeight + 'px';
        // dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

        if (event.pageX > columnCenter) {
          this.reorderIndicatorUp.nativeElement.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
          this.reorderIndicatorDown.nativeElement.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
          this.dropPosition = 1;
        }
        else {
          this.renderer.setStyle(this.reorderIndicatorUp.nativeElement, 'left', (targetLeft - Math.ceil(iconWidth / 2)) + 'px');
          this.renderer.setStyle(this.reorderIndicatorDown.nativeElement, 'left', (targetLeft - Math.ceil(iconWidth / 2)) + 'px');
          this.dropPosition = -1;
        }

        this.reorderIndicatorUp.nativeElement.style.display = 'block';
        this.reorderIndicatorDown.nativeElement.style.display = 'block';
      }
      else {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onColumnDragleave(event, column: ITreeTableColumn) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      this.reorderIndicatorUp.nativeElement.style.display = 'none';
      this.reorderIndicatorDown.nativeElement.style.display = 'none';
    }
  }
  public getHiddenElementOuterWidth(element): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    let elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementWidth;
  }
  public getHiddenElementOuterHeight(element): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    let elementHeight = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  onColumnDrop(event, column: ITreeTableColumn) {
    event.preventDefault();
    if (this.draggedColumn) {
      let dragIndex = this.treeTableDisplayedColumns.findIndex(col => col == this.draggedColumn.name);
      let dropIndex = this.treeTableDisplayedColumns.findIndex(col => col == column.name);

      let allowDrop = (dragIndex != dropIndex);
      if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
        allowDrop = false;
      }

      if (allowDrop && (!this.rowHeadersVisible || (this.rowHeadersVisible && dropIndex != 0))) {

        this.reorderArray(this.treeTableDisplayedColumns, dragIndex, dropIndex);
        //this.treeTableDisplayedColumns.splice(dropIndex, 0, this.treeTableDisplayedColumns.splice(dragIndex, 1)[0]));

        this.onColReorder.emit({
          dragIndex: dragIndex,
          dropIndex: dropIndex,
          columns: this.treeTableDisplayedColumns
        });
      }

      this.reorderIndicatorUp.nativeElement.style.display = 'none';
      this.reorderIndicatorDown.nativeElement.style.display = 'none';
      this.draggedColumn.draggable = false;
      this.draggedColumn = null;
      this.dropPosition = null;

    }
  }
  reorderArray(value: any[], from: number, to: number) {
    let target: number;
    if (value && (from !== to)) {
      if (to >= value.length) {
        target = to - value.length;
        while ((target--) + 1) {
          value.push(undefined);
        }
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  }

  /**过滤 */

  keywordFilter(value, filter) {
    let globalMatch = false;
    for (let j = 0; j < this.treeTableColumns.length; j++) {
      let col = this.treeTableColumns[j];
      if (filter && !globalMatch) {
        globalMatch = ExpressionOperators['contains'](this.resolveFieldData(value, col.name), filter);
      }
    }
    if (filter) {
      return globalMatch;
    }
    return true;
  }

  parseFilter(filterStr: string) {
    return new Function('it', 'return (' + filterStr + ');');
  }
  genFilterExpression(filter) {
    let root: FilterMetadata = { IsChildExpress: true };
    root.childs = this.filters;
    this.RecursionGenerateExpression(root);
    let rowFilterFunc = root.Expression ? root.Expression : (it) => true;
    let presetFilterFunc = (this.filterExpression ? this.parseFilter(this.filterExpression) : (it) => true);
    return it => presetFilterFunc(it) && rowFilterFunc(it) && this.keywordFilter(it, filter);
  }
  logicPriority = { not: 3, and: 2, or: 1 };
  private filterMetaConvertToExpressionTree(filterMetas: FilterMetadata[], allowMerge: boolean = true,
    root: Expression = null, parentLogicNode: Expression = null) {
    let firstFilterMeta = filterMetas[0];
    let reverseMetas = filterMetas;
    let prevLogicNode: Expression = parentLogicNode;
    while (reverseMetas.length > 0) {
      let nextFilterMeta = reverseMetas.pop();
      let nextLogicNode: Expression, nextOperatorNode: Expression, notNode: Expression;
      let isFirstExpr = (firstFilterMeta == nextFilterMeta);
      let isExistedLogic = allowMerge && !nextFilterMeta.IsChildExpress &&
        prevLogicNode && nextFilterMeta.concat == prevLogicNode.nodeType;

      if (nextFilterMeta.not) {
        notNode = {
          nodeType: 'not',
          priority: this.logicPriority['not'],
          rightExpression: null
        };
      }
      if (isFirstExpr || isExistedLogic)
        nextLogicNode = null;
      else {
        let ndType = (nextFilterMeta.concat == undefined || nextFilterMeta.concat == 'none') ? 'and' : nextFilterMeta.concat;
        nextLogicNode = { //逻辑结点
          nodeType: ndType,
          expressions: [],
          priority: this.logicPriority[ndType]
        };
        if (!root) { root = nextFilterMeta.not ? notNode : nextLogicNode; }
      }
      if (!nextFilterMeta.IsChildExpress) {//非虚拟结点时创建操作结点
        nextOperatorNode = {
          nodeType: nextFilterMeta.operators,
          property: nextFilterMeta.field,
          expressions: [],
          rightExpression: {
            nodeType: 'constant',
            value: nextFilterMeta.value
          }
        };
      }
      if (nextLogicNode) {
        if (nextOperatorNode) {
          if (notNode) {
            notNode.rightExpression = nextOperatorNode;
            nextLogicNode.expressions.unshift(notNode);
          } else
            nextLogicNode.expressions.unshift(nextOperatorNode);
        }
      }

      let isChildExpAndNot = nextFilterMeta.not && nextFilterMeta.IsChildExpress;
      if (prevLogicNode) {
        if (nextLogicNode) {
          if (prevLogicNode.nodeType == 'not')
            prevLogicNode.rightExpression = nextLogicNode;
          else if (isChildExpAndNot) {
            notNode.rightExpression = nextLogicNode;
            prevLogicNode.expressions.unshift(notNode);
          } else
            prevLogicNode.expressions.unshift(nextLogicNode);

        } else if (nextOperatorNode) {
          let nextOpNode;
          if (notNode) {
            notNode.rightExpression = nextOperatorNode;
            nextOpNode = notNode;
          } else {
            nextOpNode = nextOperatorNode;
          }
          if (prevLogicNode.nodeType == 'not')
            prevLogicNode.rightExpression = nextOpNode;
          else
            prevLogicNode.expressions.unshift(nextOpNode);

        } else if (isChildExpAndNot) {
          if (prevLogicNode.nodeType == 'not')
            prevLogicNode.rightExpression = notNode;
          else
            prevLogicNode.expressions.unshift(notNode);
        }

      }

      if (nextLogicNode) {
        if (!isChildExpAndNot)
          prevLogicNode = nextLogicNode;
      } else if (isChildExpAndNot)
        prevLogicNode = notNode;

      if (nextFilterMeta.childs && nextFilterMeta.childs.length > 0)
        this.filterMetaConvertToExpressionTree(nextFilterMeta.childs, allowMerge, root,
          isChildExpAndNot ? notNode : prevLogicNode);
    }
    if (root.expressions.length > 1)
      return root;
    else
      root.expressions[0];
  }
  private RecursionGenerateExpression(root: FilterMetadata) {
    //生成相应的表达式树
    if (!root.IsChildExpress) {
      if (root.IsSetNode && !root.IsCustomColumnFilter)
        this.RecursionGenerateListExpression(root);
      else
        this.GenerateExpression(root);
    }
    root.childs && root.childs.forEach(child => {
      if (!(child.IsSetNode && root.IsProcessDone)) {
        this.RecursionGenerateExpression(child);
      }
      //拼接表达式树
      // this.ConcatExpression(root, child, root.childs[0] == child, root.childs[root.childs.length - 1] == child);
    });
    root.childs && this.combineFilter(root, root.childs); //43767
  }
  RecursionGenerateListExpression(c) {

  }
  operators = {
    eq: ExpressionOperators.equals,
    ne: ExpressionOperators.notEquals,
    lt: ExpressionOperators.lessThan,
    nlt: ExpressionOperators.notLessThan,
    lte: ExpressionOperators.lessThanOrEqual,
    nlte: ExpressionOperators.notLessThanOrEqual,
    gt: ExpressionOperators.greaterThan,
    ngt: ExpressionOperators.notGreaterThan,
    gte: ExpressionOperators.greaterThanOrEquals,
    ngte: ExpressionOperators.notGreaterThanOrEquals,
    like: ExpressionOperators.like,
    notLike: ExpressionOperators.notLike,
    contains: ExpressionOperators.contains,
    notContains: ExpressionOperators.notContains,
    between: ExpressionOperators.between,
    notBetween: ExpressionOperators.notBetween,
    in: ExpressionOperators.in,
    notIn: ExpressionOperators.notIn,
    startsWith: ExpressionOperators.startsWith,
    notStartsWith: ExpressionOperators.notStartsWith,
    endsWith: ExpressionOperators.endsWith,
    notEndsWith: ExpressionOperators.notEndsWith,
    isNull: ExpressionOperators.isNull,
    isNotNull: ExpressionOperators.isNotNull,
    fuzzy: ExpressionOperators.fuzzy,
    notFuzzy: ExpressionOperators.notFuzzy
  }
  GenerateExpression(filterMeta: FilterMetadata) {
    let expr = null;
    if (filterMeta.IsCustomColumnFilter || filterMeta.IsSetOperation) {
      // var leftParamExpr = this.Parameters[0];
      // var rightParamExpr = filterRequest.SrcExpression.Parameters[0];
      // var visitor = new ReplaceExpressionVisitor(rightParamExpr, leftParamExpr);
      // var rightBodyExpr = visitor.Visit(filterRequest.SrcExpression.Body);
      // filterRequest.Expression = rightBodyExpr;
      return;
    }
    //if (filterRequest.PropClassify == PropClassify.List)
    //{
    //    return;
    //}
    //根据操作符生成相应的表达式
    let filterValue = filterMeta.value,
      filterField = filterMeta.field,
      filterOperator = filterMeta.operators || 'startsWith';
    let filterFunc = this.operators[filterOperator];  //ExpressionOperators[filterMatchMode];
    filterMeta.Expression = it => {
      let dataFieldValue = filterMeta.customValue ? filterMeta.customValue(it) :
        this.resolveFieldData(it, filterField);
      return filterFunc && filterFunc(dataFieldValue, filterValue);
    }
  }
  combineFilter<T>(rootFilter: FilterMetadata, childFilters: FilterMetadata[]) {
    let isFirst = true;
    for (let childFilter of childFilters) {
      let childFunc = childFilter.Expression;
      let func = rootFilter.Expression;
      if (isFirst) {
        if (childFilter.not)
          rootFilter.Expression = value => !childFunc(value);
        else
          rootFilter.Expression = value => childFunc(value);
        isFirst = false;
      } else {
        if (childFilter.concat == 'or') {
          if (childFilter.not)
            rootFilter.Expression = value => func(value) || !childFunc(value);
          else
            rootFilter.Expression = value => func(value) || childFunc(value);
        } else {
          if (childFilter.not)
            rootFilter.Expression = value => func(value) && !childFunc(value);
          else
            rootFilter.Expression = value => func(value) && childFunc(value);
        }
      }
    }
    if (rootFilter.not) {
      let func = rootFilter.Expression;
      rootFilter.Expression = value => !func(value);
    }
  }
  ConcatExpression(root: FilterMetadata, child: FilterMetadata, first: boolean, last: boolean) {
    let childFunc: Function = child.Expression,
      func: Function = root.Expression;
    if (first) {
      if (child.not)
        root.Expression = (value) => !childFunc(value);
      else
        root.Expression = value => childFunc(value);
    }
    else if (child.concat == 'and' || child.concat == 'none' || !child.concat) {
      if (child.not)
        root.Expression = value => func(value) && !childFunc(value);
      else
        root.Expression = value => func(value) && childFunc(value);
    }
    else if (child.concat == 'or') {
      if (child.not)
        root.Expression = value => func(value) || !childFunc(value);
      else
        root.Expression = value => func(value) || childFunc(value);
    }
    if (last) {
      if (root.not) {
        func = root.Expression;
        root.Expression = value => !func(value);
      }
    }
  }
  onFilterKeyup(value: any, field: any, matchMode: any) {
    // if (this.filterTimeout) {
    //   clearTimeout(this.filterTimeout);
    // }

    // this.filterTimeout = setTimeout(() => {
    //   this.filter(value, field, matchMode);
    //   this.filterTimeout = null;
    // }, this.filterDelay);
  }

  contentFilters = {};
  filter(meta: FilterMetadata) {
    // let filterIdx = this.filters.findIndex(f => f.field == meta.field);
    // if (filterIdx != -1) this.filters.splice(filterIdx, 1);
    this.filters = this.filters.filter(it => it.field != meta.field);
    if (!this.isFilterBlank(meta.value)) {
      this.filters.push(meta);
      if (['in', 'notIn'].some(it => it == meta.operators)) {
        this.contentFilters[meta.field] = meta.value;
      }
    }
    else {
      delete this.contentFilters[meta.field];
    }
    // if (!this.lazy)
    //   this.treeTableGlobalFilter();
    this.onColumnFilter.emit({
      filters: this.filters
    });
  }
  lazyloadSub: Subscription;

  private _lastKeywordInput = '';
  listenLazyLoad() {
    // If the user changes the sort order, reset back to the first page.
    if (this.adkSort)
      this.adkSort.sortChange.subscribe(() => {
        if (this.lazy && this.paginator)
          this.paginator.pageIndex = 0;
        this.sortExpression = this.adkSort.active;
      });

    if (!this.lazy) {
      this.onColumnFilter.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(res => {
        this.treeTableGlobalFilter();
      });
    } else {
      let listenStreams = [this.onColumnFilter];
      if (this.adkSort) listenStreams.push(this.adkSort.sortChange);
      if (this.paginator) listenStreams.push(this.paginator.page);
      this.lazyloadSub = merge(...listenStreams)
        .pipe(
        filter(it => this.lazy),
        debounceTime(150),
        distinctUntilChanged()
        ).subscribe(res => {
          if (this.lazy)
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        });
    }
    fromEvent<Event>(this.globalFilterEl.nativeElement, 'keyup')
      .pipe(
      debounceTime(150),
      distinctUntilChanged()
      ).subscribe((e: any) => {
        if (e.target.value != this._lastKeywordInput)
          this.onColumnFilter.emit({ keyword: e.target.value });
        this.lastColumnDef = e.target.value;
      });
    if (this.filters && this.filters.length > 0)
      this.onColumnFilter.emit({ filters: this.filters });
  }
  createLazyLoadMetadata(): LazyLoadEventArgs {
    return {
      firstRowOffset: this.paginator ? this.paginator.pageSize * (this.paginator.pageIndex + 1) : 0,
      page: this.paginator ? this.paginator.pageIndex + 1 : 0,
      pageSize: this.paginator ? this.paginator.pageSize : 0,
      columnSortMeta: this._sortExprToSortMeta(),
      columnFilters: this.filters,
      filterKeyword: this.keywordExpression ? this.keywordExpression : null,
    };
  }

  private _sortExprToSortMeta() {
    let activeSorts: columnSortMeta[] = [];
    if (!this.sortExpression) return activeSorts;
    let sortFields = this.sortExpression.split(',');
    sortFields.forEach(field => {
      let sortInfos = field.split(' ');
      if (sortInfos.length == 1)
        activeSorts.push({
          field: sortInfos[0],
          asc: true
        });

      if (sortInfos.length == 2)
        activeSorts.push({
          field: sortInfos[0],
          asc: sortInfos[1].toLowerCase() == 'asc' ? true : false
        });
    });
    return activeSorts;
  }

  isFilterBlank(filter): boolean {
    if (filter !== null && filter !== undefined) {
      if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
        return true;
      else
        return false;
    }
    return true;
  }
  @Input() lazy: boolean;
  @Input() filters: FilterMetadata[] = [
    // { field: 'gono', value: 'p010102', operators: 'contains' },
    // { field: 'goname', value: '铁板牙', operators: 'contains', concat: 'and' }
  ];
  filters2: FilterMetadata[] = [
    { field: 'gono', value: 'P010102156H', operators: 'contains' },
    {
      field: "group1", value: "", operators: "none", concat: 'and', IsChildExpress: true, childs: [
        { field: 'goname', value: '铁板牙', operators: 'contains', concat: 'none' },
        { field: 'goname', value: '圆头十字', operators: 'contains', concat: 'or' }
      ]
    },
    { field: 'goname', value: '铁板牙', operators: 'contains', concat: 'and' }
  ];
  // @Input() filterExpression3: string = "gono contains 'p010102',goname contains '铁板牙' and";
  @Input() filterExpression: string = "true"; // || it.gono.startsWith('P010102156') || it.gono.startsWith('R001W44ZCE')";
  private _keywordExpression: string = '';
  @Input() get keywordExpression() {
    return this._keywordExpression;
  }
  private _keywordInput: boolean;
  set keywordExpression(newValue) {
    if (this._keywordExpression != newValue) {
      this._keywordExpression = newValue;
      this._lastKeywordInput = newValue;
      this.onColumnFilter.emit({ keyword: newValue });
    }
  }
  @Output() onColumnFilter: EventEmitter<any> = new EventEmitter<any>();

  // keywordFilter(dataRow: ITreeTableRow, filter) {

  //   let globalMatch = false;

  //   for (let j = 0; j < this.treeTableColumns.length; j++) {
  //     let col = this.treeTableColumns[j];
  //     if (filter && !globalMatch) {
  //       globalMatch = this.filterConstraints['contains'](this.resolveFieldData(dataRow.dataBoundItem, col.name), filter);
  //     }
  //   }
  //   if (filter) {
  //     return globalMatch;
  //   }
  //   return true;
  // }

  _filterPredicate(dataRow: ITreeTableRow, filter: string): boolean {
    let localMatch = true;
    let globalMatch = false;

    for (let j = 0; j < this.treeTableColumns.length; j++) {
      let col = this.treeTableColumns[j],
        filterMeta = this.filters.find(f => f.field == col.name);

      //local
      if (filterMeta) {
        let filterValue = filterMeta.value,
          filterField = col.name,
          filterMatchMode = filterMeta.operators || 'startsWith',
          dataFieldValue = this.resolveFieldData(dataRow.dataBoundItem, filterField);
        let filterConstraint = this.filterConstraints[filterMatchMode];

        if (!filterConstraint(dataFieldValue, filterValue)) {
          localMatch = false;
        }

        if (!localMatch) {
          break;
        }
      }

      //global
      if (filter && !globalMatch) {
        globalMatch = this.filterConstraints['contains'](this.resolveFieldData(dataRow.dataBoundItem, col.name), filter);
      }
    }

    let matches = localMatch;
    if (filter) {
      matches = localMatch && globalMatch;
    }
    return matches;
  }

  hasFilter() {
    let empty = true;
    if (this.filters && this.filters.length > 0)
      empty = false;
    return !empty || this.keywordExpression;
  }

  onFilterInputClick(event: any) {
    event.stopPropagation();
  }
  makeFilterExpression(funBody, args: string[] = []) {
    return new Function(...args, funBody);
  }

  filterConstraints = {

    startsWith(value, filter): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = filter.toLowerCase();
      return value.toString().toLowerCase().slice(0, filterValue.length) === filterValue;
    },

    contains(value, filter): boolean {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    },

    endsWith(value, filter): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = filter.toString().toLowerCase();
      return value.toString().toLowerCase().indexOf(filterValue, value.toString().length - filterValue.length) !== -1;
    },

    equals(value, filter): boolean {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString().toLowerCase() == filter.toString().toLowerCase();
    },

    in(value, filter: any[]): boolean {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      for (let i = 0; i < filter.length; i++) {
        if (filter[i] === value)
          return true;
      }

      return false;
    }
  }

  /** 表结构 */
  @ViewChild(AdkSort) adkSort: AdkSort;
  @ViewChild('fixHeaderContainer', { read: ElementRef }) fixHeaderContainer: ElementRef;
  get fixHeaderContainerElRef() {
    return this.fixHeaderContainer.nativeElement as HTMLElement;
  }
  @ViewChildren('matHeaderRow', { read: ElementRef }) headerRowElementRefs: QueryList<ElementRef>;
  get matHeaderRowElRef() {
    return this.headerRowElementRefs.first.nativeElement as HTMLElement;
  }

  @Input() tabindex: number = 1;
  @Input() columnHeadersVisible: boolean = true;
  @Input() rowHeadersVisible: boolean = true;
  @Input() fixHeaderRow: boolean = false;
  @Input() sortExpression: string = "ord asc,goname desc,gg asc";
  rows: ITreeTableRow[] = []; //表格行
  dataColumns: ITreeTableColumn[] = [];
  currentCell: ITreeTableRowCell;        //获取当前单元格
  currentRow;        //获取包含当前单元格的行
  selectedRows;     // 获取用户选定行的集合
  dataSources; //数据源   
  @Output() currentCellChanged: EventEmitter<any> = new EventEmitter<any>(); //当选择单元格时发生
  @Output() cellContentClick: EventEmitter<any> = new EventEmitter<any>();   //当点击某个单元格时发生 
  @Output() cellBeginEdit: EventEmitter<any> = new EventEmitter<any>();   //当某个单元格开始编辑时发生
  @Output() cellStyleRenderer: EventEmitter<any> = new EventEmitter<any>(); //当某个单元格样式重新渲染时发生

  private getRowCell(row: ITreeTableRow, col: ITreeTableColumn) {
    if (row && col) {
      let rowIdx = this.getCellRowIndex(row);
      let colIdx = this.getCellColumnIndex(col.name);
      return row.cells.find(cell => cell.columnName == col.name ||
        (cell.rowIndex == rowIdx && cell.columnIndex == colIdx));
    } else return null;

  }
  rowCellClick(event, row: ITreeTableRow, col: ITreeTableColumn) {
    let cell = this.getRowCell(row, col);
    if (this.currentCell != cell) {
      this.currentCell = cell;
      this.currentCellChanged.emit({ row, col, cell });
    }
    if (this.currentRow != row) {
      this.currentRow = row;
    }
    this.cellContentClick.emit({ row, col, cell });
  }
  private cloneHeaderRow;
  private parentNode;
  private fixedTableHeaderRow() {
    if (this.fixHeaderRow && this.fixHeaderContainer) {
      if (!this.cloneHeaderRow)
        this.cloneHeaderRow = this.matHeaderRowElRef.cloneNode(true);
      if (!this.parentNode) {
        this.parentNode = this.matHeaderRowElRef.parentNode;
        this.parentNode.insertBefore(this.cloneHeaderRow, this.parentNode.childNodes[0]);
      }
      this.headerRowElementRefs
        .changes
        .subscribe(headerRowRef => {
          this.fixHeaderContainerElRef.appendChild(headerRowRef.first.nativeElement);
        });
    }
  }
  treeTableSortingDataAccessor(data: ITreeTableRow, sortHeaderId: string): string | number {

    const value: any = data.dataBoundItem[sortHeaderId];

    // If the value is a string and only whitespace, return the value.
    // Otherwise +value will convert it to 0.
    if (typeof value === 'string' && !value.trim()) {
      return value;
    }

    return isNaN(+value) ? value : +value;
  }
  paginator: MatPaginator;
  @Output() onLazyLoad: EventEmitter<LazyLoadEventArgs> = new EventEmitter<LazyLoadEventArgs>();


  filterOverlayRef: OverlayRef;
  close() {
    if (this.filterOverlayRef) {
      this.filterOverlayRef.detach();
      this.filterOverlayRef.dispose();
      this.filterOverlayRef = null;
      if (this.closeOverlayRef) {
        this.closeOverlayRef.unsubscribe();
        this.closeOverlayRef = null;
      }
    }
  }

  filterRule: IRule = { operator: 'and', rules: [] };
  getColumnFilterRule(colDef: ITreeTableColumn) {
    let columnFilterRule = this.filterRule.rules.find(it => it.key == colDef.key);
    if (!columnFilterRule) {
      columnFilterRule = { key: colDef.key, field: colDef.name, operator: 'eq', value: null };
      this.filterRule.rules.push(columnFilterRule);
    }
    return columnFilterRule;
  }
  getColumnDatas(colDef: ITreeTableColumn) {
    return this.treeTableData.map(it => it[colDef.name]).uniquelizeWith() || [];
  }
  closeOverlayRef: Subscription;
  lastColumnDef: ITreeTableColumn;
  columeFilterIconClick(event, colDef: ITreeTableColumn) {
    event.stopPropagation();
    let createNew = this.lastColumnDef != colDef || !this.filterOverlayRef;
    if (this.filterOverlayRef) {
      this.close();
      if (this.lastColumnDef == colDef) createNew = false;
    }
    if (createNew) {
      let config = new OverlayConfig({
        minWidth: 322,
        width: 322,
        height: 322
      });

      let customTokens = new WeakMap<any, any>();
      let parentInjector = this.injector;

      let dataItem = new ColumnFilterItem(colDef, this.getColumnDatas(colDef), this.getColumnFilterRule(colDef), this);
      customTokens.set(COLUMN_FILTER_ITEMTOKEN, dataItem);
      let injector = new PortalInjector(parentInjector, customTokens);

      let curTarget = event.target;
      let absPos = this.domHandler.getOffset(curTarget);
      let absLeft = absPos.left,
        absTop = absPos.top + curTarget.offsetHeight;
      config.positionStrategy = this.overlay
        .position()
        .global()
        .width('322')
        .height('322')
        .left(`${absLeft}px`)
        .top(`${absTop}px`);

      this.filterOverlayRef = this.overlay.create(config);
      const compPortal = new ComponentPortal(ColumnFilterComponent, null, injector);
      this.filterOverlayRef.attach(compPortal);
      this.closeOverlayRef = fromEvent(document, 'click')
        .subscribe(e => this.close());
    }
    this.lastColumnDef = colDef;
  }
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


interface ITreeTableRow {
  rowNo?: number;
  collapsed?: boolean;
  visible?: boolean;
  level?: number;
  dataBoundItem?;
  cells?: ITreeTableRowCell[];
  table?;

}
interface ITreeTableRowCell {

  columnName?: string;
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

interface SortMeta {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterMetadata {
  id?: number;
  parentId?: number;
  field?: string;
  operators?: string;
  value?;
  customValue?: Function;
  concat?: string;
  not?: boolean;
  isGroup?: boolean;
  childs?: FilterMetadata[];
  IsChildExpress?: boolean;
  IsCustomColumnFilter?: boolean;
  IsSetNode?: boolean;
  IsProcessDone?: boolean;
  IsSetOperation?: boolean;
  Expression?;
  regExp?: RegExp
}