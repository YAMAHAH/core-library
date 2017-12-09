
import { Directive, Component, ViewChild, TemplateRef, Input } from '@angular/core';


/** The floating placeholder for an `MatFormField`. */
@Component({
  selector: 'gx-form-item-placeholder',
  template: `
    <ng-template #tempRef>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class FormItemPlaceholder {
  @Input() data;

  @ViewChild('tempRef', { read: TemplateRef }) placeholderTempRef: TemplateRef<any>;

  get tempInfo() {
    return { tempRef: this.placeholderTempRef, context: this.data };
  }
}
