// Angular Imports
import { NgModule, ModuleWithProviders } from '@angular/core';

// This Module's Components
import { PageViewer } from './page-viewer';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../shared/shared-module';
import { PageViewerService } from './page-viewer.service';


@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [
        PageViewer,
    ],
    exports: [
        PageViewer,
    ],
    entryComponents: [PageViewer]
})
export class PageViewerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PageViewerModule,
            providers: [PageViewerService]
        };
    }
}
