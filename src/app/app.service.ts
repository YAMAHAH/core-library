import { AuthGuard } from './common/auth/auth.guard';
import { AuthService } from './services/AuthService';
import { MyDataResolver } from './common/my-data-resolver';
import { LoadScriptService } from './services/LoadScriptService';
import { CanPageAnimateGuard } from './common/page-animate-guard';
import { HttpService } from './services/http.service';
import { BlockUIService } from './services/blockui.service';
import { AppGlobalService } from './services/AppGlobalService';
import { RouterService } from './services/router.service';
import { FormService } from './components/form/FormService';
import { CarService } from './services/car/carService';
import { DownloadManager } from './services/DownloadManager';
import { HTMLElementExtendService } from './untils/html-element-extend';
import { SelectivePreloadingStrategy } from './services/SelectivePreloadingStrategy';
import { PageStatusMonitor } from '@framework-services/application/PageStatusMonitor';

export const appRootProviders = [
    AuthGuard,
    AuthService,
    MyDataResolver,
    LoadScriptService,
    CanPageAnimateGuard,
    HttpService,
    BlockUIService,
    AppGlobalService,
    RouterService,
    DownloadManager,
    CarService,
    HTMLElementExtendService,
    SelectivePreloadingStrategy,
    PageStatusMonitor
];