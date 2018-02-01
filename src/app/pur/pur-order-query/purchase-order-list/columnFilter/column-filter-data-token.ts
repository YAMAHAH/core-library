import { InjectionToken } from '@angular/core';
import { ITreeTableColumn } from '../table-column';


export const COLUMN_FILTER_DATATOKEN = new InjectionToken<ITreeTableColumn>('TableColumnFilterDataToken');