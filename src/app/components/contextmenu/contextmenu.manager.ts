import { Injectable } from '@angular/core';
import { ContextMenu } from './contextmenu';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Injectable()
export class ContextMenuManager {
    constructor() {
        fromEvent(document, 'contextmenu')
            .subscribe(e => this.documentContextmenu(e));
        fromEvent(document, 'mousedown')
            .subscribe(e => this.documnetRightClick(e));
    }

    private contextMenus: ContextMenu[] = [];

    registerContextMenu(contextMenu: ContextMenu) {
        if (this.contextMenus.contains(contextMenu)) return;
        this.contextMenus.push(contextMenu);
    }
    unRegisterContextMenu(contextMenu: ContextMenu) {
        if (this.contextMenus.contains(contextMenu))
            this.contextMenus.remove(contextMenu);
    }

    hasContextMenu(contextMenu: ContextMenu) {
        return this.contextMenus.contains(contextMenu);
    }
    get contextMenuCount() {
        return this.contextMenus.length;
    }

    closeAllContextMenu() {
        this.contextMenus.forEach(m => m.hide());
    }
    documentContextmenu(event: any) {
        event.preventDefault();
        if (document.all) {
            event.cancelBubble = true;
            event.returnvalue = false;
            return false;
        }
        if (this.contextMenuCount > 0) this.closeAllContextMenu();
    }

    documnetRightClick(event: any) {
        // console.log(event);
        //  event.preventDefault();
        if (this.contextMenuCount > 0) this.closeAllContextMenu();
        // if (document.all) {
        //     if (event.button === 2) {
        //         event.returnvalue = false;
        //     }
        // }
        // if (window.hasOwnProperty('Event')) {
        //     if (event.which == 2 || event.which == 3)
        //         return false;
        // }
        // else if (event.button == 2 || event.button == 3) {
        //     event.cancelBubble = true
        //     event.returnValue = false;
        //     return false;
        // }
    }
}