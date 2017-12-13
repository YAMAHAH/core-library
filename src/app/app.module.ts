import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app.component';
import { rootRouterConfig } from './app.router';

import { appRootProviders } from './app.service';
import { PageLoadingModule } from './common/page-loading';
import { PCLayoutComponent } from './pc.layout.component';
import { LayoutModule } from './common/layout/layout-module';
import { XYZUIModule } from './common/rebirth-ui.module';
import { ToastyModule } from './common/toasty/index';
import { WebFormModule } from './components/form/FormModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageViewerModule } from './common/page-viewer/page-viewer.module';
import { HttpClientModule } from '@angular/common/http';
import { MediaQueriesModule } from './services/mediaquery/MediaQueriesModule';
import { contextMenuManagerProvider } from './components/contextmenu/ContextMenuModule';
import { SelectivePreloadingStrategy } from './services/SelectivePreloadingStrategy';
import { AppRouterReuseStrategy } from '@framework-services/AppRouterReuseStrategy';
import { GlobalCSSVariables } from '@framework-services/GlobalCSSVariables';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    RouterModule.forRoot(rootRouterConfig, {
      enableTracing: false,
      useHash: false,
      preloadingStrategy: SelectivePreloadingStrategy
    }),
    PageLoadingModule.forRoot(),
    XYZUIModule.forRoot(),
    ToastyModule.forRoot(),
    WebFormModule.forRoot(),
    PageViewerModule.forRoot(),
    MediaQueriesModule,
    FlexLayoutModule
  ],
  declarations: [AppComponent, PCLayoutComponent],
  bootstrap: [AppComponent],
  providers: [
    ...appRootProviders,
    contextMenuManagerProvider,
    GlobalCSSVariables,
    // {
    //   provide: GlobalCSSVariables,
    //   useFactory: (renderer: Renderer2) => { return new GlobalCSSVariables(); },
    //   deps: []
    // },
    { provide: RouteReuseStrategy, useClass: AppRouterReuseStrategy }
  ]
})
export class AppModule {
  constructor() {
  }
}
