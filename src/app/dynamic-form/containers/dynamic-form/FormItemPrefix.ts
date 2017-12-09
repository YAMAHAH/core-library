
import { Directive, Component, Input, ViewChild, TemplateRef } from '@angular/core';


/** Prefix to be placed the the front of the form field. */
@Component({
  selector: 'gx-form-item-prefix',
  template: `
    <ng-template #tempRef>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class FormItemPrefix {
  @Input() data;

  @ViewChild('tempRef', { read: TemplateRef }) prefixTempRef: TemplateRef<any>;


}