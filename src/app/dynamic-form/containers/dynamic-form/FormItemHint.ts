

import { Input, Component, TemplateRef, ViewChild } from '@angular/core';


/** Hint text to be shown underneath the form field control. */
@Component({
  selector: 'gx-form-item-hint',
  template: `
    <ng-template #tempRef>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class FormItemHint {

  /** Whether to align the hint label at the start or end of the line. */
  @Input() align: 'start' | 'end' = 'start';
  @Input() data;

  /** Unique ID for the hint. Used for the aria-describedby on the form field control. */

  @ViewChild('tempRef', { read: TemplateRef }) hintTempRef: TemplateRef<any>;
  
  
}