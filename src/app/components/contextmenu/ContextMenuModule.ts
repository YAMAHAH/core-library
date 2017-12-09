import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContextMenu } from './contextmenu';
import { ContextMenuSub } from './ContextMenuSub';
import { ContextMenuManager } from './contextmenu.manager';

export const contextMenuManagerProvider = { provide: ContextMenuManager, useClass: ContextMenuManager };

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [ContextMenu],
    declarations: [ContextMenu, ContextMenuSub]
})
export class ContextMenuModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContextMenuModule,
            providers: [contextMenuManagerProvider]
        };
    }
}