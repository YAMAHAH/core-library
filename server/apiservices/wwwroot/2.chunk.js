webpackJsonp([2,10],{

/***/ "./node_modules/css-loader/index.js!./src/app/common/mobile-index/mobile-index.component.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },

/***/ "./src/app/common/mobile-index/mobile-index.component.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/common/mobile-index/mobile-index.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/common/mobile-index/mobile-index.component.html":
/***/ function(module, exports) {

module.exports = "<h1>Hello {{name}}</h1>\n\n<a [routerLink]=\"['/mobile/home']\">  home </a>\n<a [routerLink]=\"['/mobile/news']\"> news  </a>\n<a [routerLink]=\"['/mobile/staticnews']\">  staticnews </a>\n<a [routerLink]=\"['/mobile/news/',{outlets:{bottom:'auxnews'}}]\"> auxnews </a>\n<a [routerLink]=\"['/mobile/d3']\"> d3 </a>\n<a [routerLink]=\"['/auth/login']\">Logout</a>\n<button (click)=\"logout()\" class=\"btn btn-success\">注销</button>\n<pageloading></pageloading>\n<router-outlet></router-outlet>\n<router-outlet name=\"bottom\"></router-outlet>\n<router-outlet name=\"right\"></router-outlet>"

/***/ },

/***/ "./src/app/common/mobile-index/mobile-index.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var auth_service_1 = __webpack_require__("./src/app/services/auth.service.ts");
var MobileIndexComponent = (function () {
    function MobileIndexComponent(authService) {
        this.authService = authService;
        this.name = 'Angular Aot Complier for Mobile';
    }
    MobileIndexComponent.prototype.logout = function () {
        this.authService.logout("/auth/login");
    };
    return MobileIndexComponent;
}());
MobileIndexComponent = __decorate([
    core_1.Component({
        selector: 'mobile-index',
        template: __webpack_require__("./src/app/common/mobile-index/mobile-index.component.html"),
        styles: [__webpack_require__("./src/app/common/mobile-index/mobile-index.component.css")]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], MobileIndexComponent);
exports.MobileIndexComponent = MobileIndexComponent;


/***/ },

/***/ "./src/app/common/mobile-index/mobile-index.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Angular Imports
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
// This Module's Components
var mobile_index_component_1 = __webpack_require__("./src/app/common/mobile-index/mobile-index.component.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var mobile_index_router_1 = __webpack_require__("./src/app/common/mobile-index/mobile.index.router.ts");
var shared_module_1 = __webpack_require__("./src/app/common/shared/shared-module.ts");
var page_loading_module_1 = __webpack_require__("./src/app/common/page-loading/page-loading-module.ts");
var MobileIndexModule = (function () {
    function MobileIndexModule(router) {
        this.router = router;
        console.log(router);
        // ConfigAppRoutes(this.router.config);
    }
    return MobileIndexModule;
}());
MobileIndexModule = __decorate([
    core_1.NgModule({
        imports: [
            shared_module_1.SharedModule.forRoot(),
            router_1.RouterModule.forChild(mobile_index_router_1.mobileIndexRouterConfig),
            page_loading_module_1.PageLoadingModule.forRoot()
        ],
        declarations: [
            mobile_index_component_1.MobileIndexComponent,
        ],
        exports: [
            mobile_index_component_1.MobileIndexComponent,
        ]
    }),
    __metadata("design:paramtypes", [router_1.Router])
], MobileIndexModule);
exports.MobileIndexModule = MobileIndexModule;


/***/ },

/***/ "./src/app/common/mobile-index/mobile.index.router.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var mobile_index_component_1 = __webpack_require__("./src/app/common/mobile-index/mobile-index.component.ts");
var page_animate_guard_1 = __webpack_require__("./src/app/common/page-animate-guard.ts");
var my_data_resolver_1 = __webpack_require__("./src/app/common/my-data-resolver.ts");
var auth_guard_1 = __webpack_require__("./src/app/common/auth/auth.guard.ts");
exports.mobileIndexRouterConfig = [
    {
        path: '',
        component: mobile_index_component_1.MobileIndexComponent, canActivate: [auth_guard_1.AuthGuard],
        children: [
            { path: "", redirectTo: "home", pathMatch: 'full' },
            {
                path: 'home',
                loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* nsure */(6).then((function (require) { resolve(__webpack_require__("./src/app/home/home.module.ts")['HomeModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); },
                canActivate: [page_animate_guard_1.CanPageAnimateGuard],
                resolve: { default: my_data_resolver_1.MyDataResolver }
            },
            {
                path: 'news',
                loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* nsure */(7).then((function (require) { resolve(__webpack_require__("./src/app/news/news.module.ts")['NewsModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); },
                canActivate: [page_animate_guard_1.CanPageAnimateGuard],
                resolve: { default: my_data_resolver_1.MyDataResolver }
            },
            {
                path: 'd3',
                loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* nsure */(9).then((function (require) { resolve(__webpack_require__("./src/app/d3/d3.demo.module.ts")['D3Module']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); },
                canActivate: [page_animate_guard_1.CanPageAnimateGuard],
                resolve: { default: my_data_resolver_1.MyDataResolver }
            },
            {
                path: 'staticnews',
                loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* nsure */(8).then((function (require) { resolve(__webpack_require__("./src/app/static-news/staticnews.module.ts")['StaticNewsModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); },
                canActivate: [page_animate_guard_1.CanPageAnimateGuard],
                resolve: { default: my_data_resolver_1.MyDataResolver }
            },
        ]
    },
];


/***/ },

/***/ "./src/app/common/shared/awesome-pipe.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AwesomePipe = (function () {
    function AwesomePipe() {
    }
    AwesomePipe.prototype.transform = function (phrase) {
        return phrase ? 'Awesome ' + phrase : '';
    };
    return AwesomePipe;
}());
AwesomePipe = __decorate([
    core_1.Pipe({ name: 'awesome' }),
    __metadata("design:paramtypes", [])
], AwesomePipe);
exports.AwesomePipe = AwesomePipe;


/***/ },

/***/ "./src/app/common/shared/highlight-directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var HighlightDirective = (function () {
    function HighlightDirective(renderer, el) {
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'lightgray');
    }
    return HighlightDirective;
}());
HighlightDirective = __decorate([
    core_1.Directive({ selector: '[highlight], input' }),
    __metadata("design:paramtypes", [core_1.Renderer, core_1.ElementRef])
], HighlightDirective);
exports.HighlightDirective = HighlightDirective;


/***/ },

/***/ "./src/app/common/shared/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var shared_module_1 = __webpack_require__("./src/app/common/shared/shared-module.ts");
exports.SharedModule = shared_module_1.SharedModule;
var user_service_1 = __webpack_require__("./src/app/common/shared/user-service.ts");
exports.UserService = user_service_1.UserService;


/***/ },

/***/ "./src/app/common/shared/shared-module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var title_comp_1 = __webpack_require__("./src/app/common/shared/title-comp.ts");
var highlight_directive_1 = __webpack_require__("./src/app/common/shared/highlight-directive.ts");
var awesome_pipe_1 = __webpack_require__("./src/app/common/shared/awesome-pipe.ts");
var shared_1 = __webpack_require__("./src/app/common/shared/index.ts");
var SharedModule = SharedModule_1 = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule_1,
            providers: [shared_1.UserService]
        };
    };
    return SharedModule;
}());
SharedModule = SharedModule_1 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [awesome_pipe_1.AwesomePipe, highlight_directive_1.HighlightDirective, title_comp_1.TitleComponent],
        exports: [awesome_pipe_1.AwesomePipe, highlight_directive_1.HighlightDirective, title_comp_1.TitleComponent, common_1.CommonModule,
            forms_1.FormsModule, forms_1.ReactiveFormsModule, http_1.HttpModule]
    }),
    __metadata("design:paramtypes", [])
], SharedModule);
exports.SharedModule = SharedModule;
var SharedRootModule = (function () {
    function SharedRootModule() {
    }
    return SharedRootModule;
}());
SharedRootModule = __decorate([
    core_1.NgModule({
        exports: [SharedModule],
        providers: [shared_1.UserService]
    }),
    __metadata("design:paramtypes", [])
], SharedRootModule);
exports.SharedRootModule = SharedRootModule;
var SharedModule_1;


/***/ },

/***/ "./src/app/common/shared/title-comp.html":
/***/ function(module, exports) {

module.exports = "<h1 highlight>{{title}} {{subtitle}}</h1>\n<p *ngIf=\"user\"><i>Welcome, {{user}}</i></p>"

/***/ },

/***/ "./src/app/common/shared/title-comp.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Exact copy of app/title.component.ts except import UserService from shared
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var shared_1 = __webpack_require__("./src/app/common/shared/index.ts");
var TitleComponent = (function () {
    function TitleComponent(userService) {
        this.subtitle = 'Test';
        this.title = 'Angular Share Modules for';
        this.user = '';
        this.user = userService.userName;
    }
    return TitleComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TitleComponent.prototype, "subtitle", void 0);
TitleComponent = __decorate([
    core_1.Component({
        selector: 'app-title',
        template: __webpack_require__("./src/app/common/shared/title-comp.html"),
    }),
    __metadata("design:paramtypes", [shared_1.UserService])
], TitleComponent);
exports.TitleComponent = TitleComponent;


/***/ },

/***/ "./src/app/common/shared/user-service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var UserService = UserService_1 = (function () {
    function UserService() {
        UserService_1.userName = UserService_1.userName || 'Sam Spade';
    }
    Object.defineProperty(UserService.prototype, "userName", {
        get: function () { return UserService_1.userName; },
        enumerable: true,
        configurable: true
    });
    return UserService;
}());
UserService.userName = '';
UserService = UserService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
var UserService_1;


/***/ }

});