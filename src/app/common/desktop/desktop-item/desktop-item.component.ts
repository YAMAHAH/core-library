import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavDesktopItem } from '../../../Models/nav-desktop-Item';

@Component({
    selector: 'gx-desktop-item',
    templateUrl: 'desktop-item.component.html',
    styleUrls: ['desktop-item.component.css']
})
export class DesktopItemComponent {

    @Output() ItemClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() ItemDoubleClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() item: NavDesktopItem;
    onClick(event: Event, item: any) {
        this.ItemClick.emit({ event, item });
    }

    onDblClick(event: Event, item: any) {
        this.ItemDoubleClick.emit({ event, item });
    }

}
