import { IRule } from './column-filter-interface';
import { ITreeTableColumn } from '../table-column';

export class ColumnFilterItem {
    constructor(public columnDef: ITreeTableColumn, public columnData: any[], public filterRule: IRule, public table) {

    }
}