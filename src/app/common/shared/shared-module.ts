import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TitleComponent } from './title-comp';
import { HighlightDirective } from './highlight-directive';
import { AwesomePipe } from './awesome-pipe';
import { FilterPipe } from './filter.pipe';
import { FocusDirective } from '../directives/focus.directive';
import { ComponentOutlet } from '../directives/component.outlet';
import { HostViewContainerDirective } from '../directives/host.view.container';
import { ImageLazyLoadDirective } from '../directives/img-lazy-load.directive';
import { FlexLayoutDirective } from '../directives/flex-layout.directive';
import { FlexItemDirective } from '../directives/flex-item.directive';
import { FxStyle } from '../directives/fxstyle';
import { KeyBindingDirective } from '../directives/key-binding';
import { UserService } from './user-service';
import { BorderDirective } from '@framework-common/directives/css/BordersDirective';
import { SizingDirective } from '@framework-common/directives/css/SizingDirective';
import { AppMotationObserverDirective } from '@framework-common/directives/AppMotationObserver';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    TitleComponent,
    FocusDirective,
    ComponentOutlet,
    HostViewContainerDirective,
    KeyBindingDirective,
    ImageLazyLoadDirective,
    FlexLayoutDirective,
    FlexItemDirective,
    FxStyle,
    BorderDirective,
    SizingDirective,
    AppMotationObserverDirective
  ],
  exports: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    FocusDirective,
    ComponentOutlet,
    TitleComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HostViewContainerDirective,
    KeyBindingDirective,
    BorderDirective,
    SizingDirective,
    ImageLazyLoadDirective,
    FlexLayoutDirective,
    FlexItemDirective,
    FxStyle,
    AppMotationObserverDirective
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [UserService]
    };
  }
}

@NgModule({
  exports: [CoreModule],
  providers: [UserService]
})
export class SharedRootModule { }
