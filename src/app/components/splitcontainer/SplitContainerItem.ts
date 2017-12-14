import { Directive, Input } from '@angular/core';


@Directive({
    selector: 'gx-split-container-item'
})
export class SplitContainerItem {
    @Input() panelType: 'aux' | 'main' = 'main';
}