export interface ITreeTableColumn {
  key?: string;
  name: string;
  dataType?: string;
  title: string;
  defaultValue?: any;
  readOnly?: boolean;
  visible?: boolean;
  allowColumnFilter?: boolean;
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
  headerCellStyle?;
  headerText?;
  expressionFunc?: (row, index) => any;

}