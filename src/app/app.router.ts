import { Routes } from '@angular/router';
import { PCLayoutComponent } from './pc.layout.component';
import { AuthGuard } from './common/auth/auth.guard';


// export function ConfigAppRoutes(approutes: Routes) {
//     approutes.forEach(r => {
//         let guards = r.canActivate;
//         if (!!!guards) { guards = []; }
//         guards.push(CanPageAnimateGuard);
//         r.canActivate = guards;
//         let resolveData = r.resolve;
//         if (!!!resolveData) { resolveData = {}; }
//         resolveData["default"] = MyDataResolver;
//         r.resolve = resolveData;
//     });
//     return approutes;
// }

export const rootRouterConfig: Routes =
    [
        { path: '', redirectTo: 'pc', pathMatch: 'full' },
        {
            path: 'mobile',
            loadChildren: "./common/mobile-index/mobile-index.module#MobileIndexModule"
        },
        {
            path: 'pc',
            component: PCLayoutComponent,
            canActivate: [AuthGuard],
            loadChildren: "./common/pc-index/index.module#IndexModule"
        },
        {
            path: 'auth',
            loadChildren: "./common/auth/auth.module#AuthModule",
            data: { preload: false }
        },
        { path: '**', redirectTo: "/auth/login" }
    ];