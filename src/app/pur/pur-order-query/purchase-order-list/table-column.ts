import { Option } from './columnFilter/column-filter-interface';
export interface ITreeTableColumn {
  key?: string;
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
  headerCellStyle?;
  headerText?;
  expressionFunc?: (row, index) => any;
  /**列过滤自定义获取options */
  getOptions?: (columnDef: ITreeTableColumn) => Option[];
  /**列过滤自定义输入类型函数 */
  getInputType?: (columnDef: ITreeTableColumn, operator: string) => string;
  /**列过滤自定义获取操作符函数 */
  getOperators?: (columnDef: ITreeTableColumn) => string[];
  /**指示列是否允许过滤 */
  allowColumnFilter?: boolean;
  /**指示列过滤是否允许空值 */
  nullable?: boolean;
  /**列过滤列表选项 */
  options?: any[];

}