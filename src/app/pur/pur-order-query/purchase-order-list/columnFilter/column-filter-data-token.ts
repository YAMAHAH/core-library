import { InjectionToken } from '@angular/core';
import { ColumnFilterItem } from './column-filter-item';

export const COLUMN_FILTER_ITEMTOKEN = new InjectionToken<ColumnFilterItem>('TableColumnFilterItemToken');