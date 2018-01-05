/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from '@angular/core';
import { AdkSortHeader } from './sort-header';
import { ADK_SORT_HEADER_INTL_PROVIDER } from './sort-header-intl';
import { CommonModule } from '@angular/common';
import { AdkSort } from './sort';


@NgModule({
  imports: [CommonModule],
  exports: [AdkSortHeader, AdkSort],
  declarations: [AdkSortHeader, AdkSort],
  providers: [ADK_SORT_HEADER_INTL_PROVIDER]
})
export class AdkSortModule { }
