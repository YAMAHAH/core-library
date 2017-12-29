import { Component, OnInit, Input, Injector, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { PageStatusMonitor } from '@framework-services/application/PageStatusMonitor';
import { MatTableDataSource, MatTable, MatSort, MatHeaderCell } from '@angular/material';
import { getMonthDays } from '@untils/dateHelper';
import { getDateRangeDays } from '../../../untils/dateHelper';
import { IWeekDays } from '@framework-models/IWeekDays';
import { IOneDay } from '../../../Models/IWeekDays';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { defer } from 'rxjs/observable/defer';

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
    protected pageStatusMonitor: PageStatusMonitor) {
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
    // this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    // this.dataSource.filterPredicate = this.filterPredicate;
    // this.dataSource.sort = this.sort;
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
  treeTableDataSource = new MatTableDataSource<ITreeTableRow>();
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
    { name: 'lineno', title: '', width: 25, resizable: false, expressionFunc: (row, index) => index + 1 },
    { name: 'gono', title: '编码', width: 200 },
    { name: 'goname', title: '名称', width: 200 },
    { name: 'gg', title: '规格' },
    { name: 'dw', title: '单位', width: 30 },
    { name: 'level', title: '层次', width: 30 },
    { name: 'ord', title: '序号', width: 30 },
  ];
  treeTableDisplayedColumns = ['lineno', 'gono', 'goname', 'gg', 'dw', 'ord', 'level'];
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
  rowCellStyle(dataRow: ITreeTableRow, dataColumn: ITreeTableColumn) {
    let style = {};
    let colWidth = this.getStyleValue(dataColumn.width);
    if (dataColumn.width)
      style['flex'] = '0 0 ' + colWidth;
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
  globalFilter() {

  }
  columnFilter(columnFilters) {

  }
  dataToDataRow() {
    let dataRows: ITreeTableRow[] = [];
    this.treeTableData.forEach(data => {
      dataRows.push({
        collapsed: false,
        visible: true,
        dataBoundItem: data,
        cells: [],
        table: null
      });
    });
    return dataRows;
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

  onColumnResizeEnd(event) {
    let delta = this.resizerHelper.nativeElement.offsetLeft - this.lastResizerHelperX;
    let columnWidth = this.resizeColumn.width;
    let newColumnWidth = columnWidth + delta;
    let minWidth = this.resizeColumn.minWidth && this.resizeColumn.minWidth || 15;
    if (columnWidth + delta > parseInt(minWidth)) {
      if (this.columnResizeMode === 'fit') {
        // let nextColumn = this.resizeColumn.nextElementSibling;
        // let nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15) { //&& nextColumnWidth > 15
          this.resizeColumn.width = newColumnWidth + 'px';
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

      let dropColumnName = 'mat-column-' + column.name;
      let dropHeader: HTMLElement = this.headerCells.find(cell => cell.nativeElement.classList.contains(dropColumnName)).nativeElement;

      let container = this.treeTableContainer.nativeElement;
      let containerOffset = this.getOffset(container);
      let dropHeaderOffset = this.getOffset(dropHeader);
      console.log(containerOffset, dropHeaderOffset);
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
      // this.headerCells.map(cell => cell.nativeElement as HTMLElement)
      //   .findIndex(cell => cell.classList.contains('mat-column-' + this.draggedColumn.name));
      let dropIndex = this.treeTableDisplayedColumns.findIndex(col => col == column.name);
      //  this.headerCells.map(cell => cell.nativeElement as HTMLElement)
      //   .findIndex(e => e.classList.contains('mat-column-' + column.name));
      let allowDrop = (dragIndex != dropIndex);
      if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
        allowDrop = false;
      }

      if (allowDrop) {
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
      console.log(this.treeTableColumns);

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
  /**排序 */
  // sort(event, column: Column) {
  //   if (!column.sortable) {
  //     return;
  //   }
  //   let targetNode = event.target;
  //   if (this.domHandler.hasClass(targetNode, 'ui-sortable-column') || this.domHandler.hasClass(targetNode, 'ui-column-title') || this.domHandler.hasClass(targetNode, 'ui-sortable-column-icon')) {
  //     if (!this.immutable) {
  //       this.preventSortPropagation = true;
  //     }

  //     let columnSortField = column.sortField || column.field;
  //     this._sortOrder = (this.sortField === columnSortField) ? this.sortOrder * -1 : this.defaultSortOrder;
  //     this._sortField = columnSortField;
  //     this.sortColumn = column;
  //     let metaKey = event.metaKey || event.ctrlKey;

  //     if (this.sortMode == 'multiple') {
  //       if (!this.multiSortMeta || !metaKey) {
  //         this._multiSortMeta = [];
  //       }

  //       this.addSortMeta({ field: this.sortField, order: this.sortOrder });
  //     }

  //     if (this.lazy) {
  //       this._first = 0;
  //       this.onLazyLoad.emit(this.createLazyLoadMetadata());
  //     }
  //     else {
  //       if (this.sortMode == 'multiple')
  //         this.sortMultiple();
  //       else
  //         this.sortSingle();
  //     }

  //     this.onSort.emit({
  //       field: this.sortField,
  //       order: this.sortOrder,
  //       multisortmeta: this.multiSortMeta
  //     });
  //   }

  //   this.updateDataToRender(this.filteredValue || this.value);
  // }

  // sortSingle() {
  //   if (this.value) {
  //     if (this.sortColumn && this.sortColumn.sortable === 'custom') {
  //       this.preventSortPropagation = true;
  //       this.sortColumn.sortFunction.emit({
  //         field: this.sortField,
  //         order: this.sortOrder
  //       });
  //     }
  //     else {
  //       this.value.sort((data1, data2) => {
  //         let value1 = this.resolveFieldData(data1, this.sortField);
  //         let value2 = this.resolveFieldData(data2, this.sortField);
  //         let result = null;

  //         if (value1 == null && value2 != null)
  //           result = -1;
  //         else if (value1 != null && value2 == null)
  //           result = 1;
  //         else if (value1 == null && value2 == null)
  //           result = 0;
  //         else if (typeof value1 === 'string' && typeof value2 === 'string')
  //           result = value1.localeCompare(value2);
  //         else
  //           result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

  //         return (this.sortOrder * result);
  //       });
  //     }

  //     this._first = 0;

  //     if (this.hasFilter()) {
  //       this._filter();
  //     }
  //   }
  // }
  multiSortMeta;
  sortMultiple() {
    // if (this.value) {
    //   this.value.sort((data1, data2) => {
    //     return this.multisortField(data1, data2, this.multiSortMeta, 0);
    //   });

    // if (this.hasFilter()) {
    //   this._filter();
    // }
    //   }
  }

  multisortField(data1, data2, multiSortMeta, index) {
    let value1 = this.resolveFieldData(data1, multiSortMeta[index].field);
    let value2 = this.resolveFieldData(data2, multiSortMeta[index].field);
    let result = null;

    if (typeof value1 == 'string' || value1 instanceof String) {
      if (value1.localeCompare && (value1 != value2)) {
        return (multiSortMeta[index].order * value1.localeCompare(value2));
      }
    }
    else {
      result = (value1 < value2) ? -1 : 1;
    }

    if (value1 == value2) {
      return (multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, multiSortMeta, index + 1)) : 0;
    }

    return (multiSortMeta[index].order * result);
  }

  addSortMeta(meta) {
    let index = -1;
    for (var i = 0; i < this.multiSortMeta.length; i++) {
      if (this.multiSortMeta[i].field === meta.field) {
        index = i;
        break;
      }
    }

    if (index >= 0)
      this.multiSortMeta[index] = meta;
    else
      this.multiSortMeta.push(meta);
    //  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  isSorted(column: ITreeTableColumn) {
    if (!column.sortable) {
      return false;
    }

    let columnSortField = column.name;

    if (this.sortMode === 'single') {
      return (this.sortField && columnSortField === this.sortField);
    }
    else if (this.sortMode === 'multiple') {
      let sorted = false;
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field == columnSortField) {
            sorted = true;
            break;
          }
        }
      }
      return sorted;
    }
  }
  sortMode: 'single' | 'multiple';
  sortOrder: number = 1;
  sortField;
  getSortOrder(column: ITreeTableColumn) {
    let order = 0;
    let columnSortField = column.name;

    if (this.sortMode === 'single') {
      if (this.sortField && columnSortField === this.sortField) {
        order = this.sortOrder;
      }
    }
    else if (this.sortMode === 'multiple') {
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field == columnSortField) {
            order = this.multiSortMeta[i].order;
            break;
          }
        }
      }
    }
    return order;
  }
  /** 表结构 */
  @Input() tabindex: number = 1;
  rows: ITreeTableRow[] = []; //表格行
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
  sortable?: boolean;
  draggable?: boolean;
  selected?: boolean;
  allowNull?: boolean;
  order?: number;
  width?;
  minWidth?;
  algin?; // 水平 垂直
  defaultCellStyle?;
  headerCell?;
  headerText?;
  expressionFunc?: (row, index) => any;

}

interface ITreeTableRow {
  collapsed?: boolean;
  visible?: boolean;
  level?: number;
  dataBoundItem?;
  cells?: ITreeTableRowCell[];
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

interface SortMeta {
  field: string;
  order: 'asc' | 'desc';
}