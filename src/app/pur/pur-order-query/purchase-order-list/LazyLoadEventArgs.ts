import { FilterMetadata } from './purchase-order-list.component';
export interface LazyLoadEventArgs {
    firstRowOffset?: number;
    page?: number;
    pageSize?: number;
    columnSortMeta?: columnSortMeta[];
    columnFilters?: FilterMetadata[];
    filterKeyword?;
}

export interface columnSortMeta {
    field?: string;
    asc: boolean;
}