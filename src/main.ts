import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { stringExtend } from './app/untils/string-extend';
import { applyMixins } from './app/untils/mixins';
import { ArrayExtensions } from './app/untils/array-extensions';

applyMixins(String, [stringExtend]);
applyMixins(Array, [ArrayExtensions]);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
