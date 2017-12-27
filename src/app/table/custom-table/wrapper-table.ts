/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Component, ContentChild, ContentChildren, Input, QueryList, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatColumnDef, MatHeaderRowDef, MatRowDef, MatTable } from '@angular/material';
import { SimpleColumn } from './simple-column';
import { CdkTable } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'wrapper-table',
  templateUrl: 'wrapper-table.html',
  styles: [`
    .mat-table {
      height: 300px;
      overflow: auto;
    }
  `]
})
export class WrapperTable<T> {
  /** Different ways the client can add column definitions */
  @ContentChildren(SimpleColumn) simpleColumns: QueryList<SimpleColumn<T>>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  @ContentChild(MatHeaderRowDef) headerRowDef: MatHeaderRowDef;
  @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<T>>;

  @ViewChild(MatTable) table: MatTable<T>;

  @Input() columns: string[];

  @Input() dataSource: DataSource<T>;

  ngAfterContentInit() {
    // Register the simple columns to the table
    this.simpleColumns.forEach(simpleColumn => (this.table as any).addColumnDef(simpleColumn.columnDef));

    // Register the normal column defs to the table
    this.columnDefs.forEach(columnDef => (this.table as any).addColumnDef(columnDef));

    // Register any custom row definitions to the table
    this.rowDefs.forEach(rowDef => (this.table as any).addRowDef(rowDef));
    // Register the header row definition.
    (this.table as any).setHeaderRowDef(this.headerRowDef);
  }
}
