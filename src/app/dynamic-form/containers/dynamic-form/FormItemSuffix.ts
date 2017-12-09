/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, Component, Input, ViewChild, TemplateRef } from '@angular/core';


/** Suffix to be placed at the end of the form field. */
@Component({
  selector: 'gx-form-item-suffix',
  template: `
    <ng-template #tempRef>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class FormItemSuffix {
  @Input() data;

  @ViewChild('tempRef', { read: TemplateRef }) suffixTempRef: TemplateRef<any>;
}
