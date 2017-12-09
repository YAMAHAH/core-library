webpackJsonp([6,10],{

/***/ "./src/app/home/about/about.component.ts":
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
var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () { };
    return AboutComponent;
}());
AboutComponent = __decorate([
    core_1.Component({
        selector: 'about',
        template: "\n        <h2>about page</h2>\n    "
    }),
    __metadata("design:paramtypes", [])
], AboutComponent);
exports.AboutComponent = AboutComponent;


/***/ },

/***/ "./src/app/home/apphome.component.ts":
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
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
__webpack_require__("./node_modules/rxjs/add/observable/timer.js");
var AppHomeComponent = (function () {
    function AppHomeComponent() {
        this.test$ = Observable_1.Observable.timer(1000, 1000);
    }
    AppHomeComponent.prototype.ngOnInit = function () { };
    return AppHomeComponent;
}());
AppHomeComponent = __decorate([
    core_1.Component({
        selector: 'apphome',
        template: "\n        <h2>Apphome page{{test$ | async }}</h2>\n        <router-outlet></router-outlet>\n    <router-outlet name = \"bottom\"></router-outlet>\n    "
    }),
    __metadata("design:paramtypes", [])
], AppHomeComponent);
exports.AppHomeComponent = AppHomeComponent;


/***/ },

/***/ "./src/app/home/contact/contact.component.ts":
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
var ContactComponent = (function () {
    function ContactComponent() {
    }
    ContactComponent.prototype.ngOnInit = function () { };
    return ContactComponent;
}());
ContactComponent = __decorate([
    core_1.Component({
        selector: 'contact',
        template: "\n        <h2>contact page</h2>\n    "
    }),
    __metadata("design:paramtypes", [])
], ContactComponent);
exports.ContactComponent = ContactComponent;


/***/ },

/***/ "./src/app/home/detail/app.detail.component.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var AppDetailComponent = (function () {
    function AppDetailComponent(router, activetedRoute) {
        this.router = router;
        this.activetedRoute = activetedRoute;
        console.log(this.activetedRoute.url);
        console.log(this.router);
        console.log(this.activetedRoute);
    }
    AppDetailComponent.prototype.ngOnInit = function () { };
    return AppDetailComponent;
}());
AppDetailComponent = __decorate([
    core_1.Component({
        selector: 'appdetail',
        template: "\n        <h2>Appdetail page</h2>\n    "
    }),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
], AppDetailComponent);
exports.AppDetailComponent = AppDetailComponent;


/***/ },

/***/ "./src/app/home/detail/detail.component.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var DetailComponent = (function () {
    function DetailComponent(router, activetedRoute) {
        this.router = router;
        this.activetedRoute = activetedRoute;
        // console.log(this.activetedRoute.url);
        // console.log(this.router);
        // console.log(this.activetedRoute);
    }
    DetailComponent.prototype.ngOnInit = function () { };
    return DetailComponent;
}());
DetailComponent = __decorate([
    core_1.Component({
        selector: 'detail',
        template: "\n        <h2>detail page</h2>\n    "
    }),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
], DetailComponent);
exports.DetailComponent = DetailComponent;


/***/ },

/***/ "./src/app/home/detail/homedetail.component.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var HomeDetailComponent = (function () {
    function HomeDetailComponent(router, activetedRoute) {
        this.router = router;
        this.activetedRoute = activetedRoute;
        // console.log(this.activetedRoute.url);
        // console.log(this.router);
        // console.log(this.activetedRoute);
    }
    HomeDetailComponent.prototype.ngOnInit = function () { };
    return HomeDetailComponent;
}());
HomeDetailComponent = __decorate([
    core_1.Component({
        selector: 'homedetail',
        template: "\n        <h2>Home detail page</h2>\n    "
    }),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
], HomeDetailComponent);
exports.HomeDetailComponent = HomeDetailComponent;


/***/ },

/***/ "./src/app/home/home.component.ts":
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
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
__webpack_require__("./node_modules/rxjs/add/observable/timer.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var page_loading_1 = __webpack_require__("./src/app/common/page-loading/index.ts");
var load_script_service_1 = __webpack_require__("./src/app/services/load-script-service.ts");
var HomeComponent = (function () {
    function HomeComponent(router, pageLoadService, loadScriptService) {
        this.router = router;
        this.pageLoadService = pageLoadService;
        this.loadScriptService = loadScriptService;
        this.test$ = Observable_1.Observable.timer(1000, 1000);
    }
    HomeComponent.prototype.ngOnInit = function () { };
    HomeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loadScriptService
            .loadSnapSvg
            .then(function (snap) {
            _this.clock();
        });
    };
    HomeComponent.prototype.clock = function () {
        var s = Snap(600, 600);
        var path = "", nums = s.text(300, 300, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            .attr({
            font: "300 40px Helvetica Neue",
            textAnchor: "middle"
        });
        for (var i = 0; i < 72; i++) {
            var r = i % 6 ? i % 3 ? 247 : 240 : 230, sin = Math.sin(Snap.rad(5 * i)), cos = Math.cos(Snap.rad(5 * i));
            path += "M" + [300 + 250 * cos, 300 + 250 * sin] + "L" + [300 + r * cos, 300 + r * sin];
            if (!(i % 6)) {
                var str = "tspan:nth-child(" + (i / 6 + 1) + ")";
                nums.select(str)
                    .attr({
                    x: 300 + 200 * Math.cos(Snap.rad(5 * i - 60)),
                    y: 300 + 200 * Math.sin(Snap.rad(5 * i - 60)) + 15,
                });
            }
        }
        var table = s.g(nums, s.path(path).attr({
            fill: "none",
            stroke: "#000",
            strokeWidth: 2
        })).attr({
            transform: "t0,210"
        });
        s.g(table).attr({
            clip: s.circle(300, 300, 100)
        });
        var hand = s.line(300, 200, 300, 400).attr({
            fill: "none",
            stroke: "#f63",
            strokeWidth: 2
        });
        s.circle(300, 300, 100).attr({
            stroke: "#000",
            strokeWidth: 10,
            fillOpacity: 0
        }).click(function () {
            Snap.animate(0, 360, function (val) {
                table.transform("t" +
                    [
                        210 * Math.cos(Snap.rad(val + 90)),
                        210 * Math.sin(Snap.rad(val + 90))
                    ]);
                hand.transform("r" + [val, 300, 300]);
            }, 12000);
        });
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home',
        template: "\n        <h2>home page{{test$ | async }}</h2>\n        <button (click)=\"pageLoadService.showPageLoading(2)\">svgAnimate</button>\n        <app-title subtitle=\"HomeAOTModule\"></app-title>\n        <router-outlet></router-outlet>\n        <router-outlet name = \"bottom\"></router-outlet>\n    "
    }),
    __metadata("design:paramtypes", [router_1.Router, page_loading_1.PageLoadingService, load_script_service_1.LoadScriptService])
], HomeComponent);
exports.HomeComponent = HomeComponent;


/***/ },

/***/ "./src/app/home/home.module.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var home_router_1 = __webpack_require__("./src/app/home/home.router.ts");
var home_component_1 = __webpack_require__("./src/app/home/home.component.ts");
var list_component_1 = __webpack_require__("./src/app/home/list/list.component.ts");
var detail_component_1 = __webpack_require__("./src/app/home/detail/detail.component.ts");
var app_detail_component_1 = __webpack_require__("./src/app/home/detail/app.detail.component.ts");
var apphome_component_1 = __webpack_require__("./src/app/home/apphome.component.ts");
var homelist_component_1 = __webpack_require__("./src/app/home/list/homelist.component.ts");
var applist_component_1 = __webpack_require__("./src/app/home/list/applist.component.ts");
var homedetail_component_1 = __webpack_require__("./src/app/home/detail/homedetail.component.ts");
var about_component_1 = __webpack_require__("./src/app/home/about/about.component.ts");
var contact_component_1 = __webpack_require__("./src/app/home/contact/contact.component.ts");
var shared_module_1 = __webpack_require__("./src/app/common/shared/shared-module.ts");
var home_service_1 = __webpack_require__("./src/app/services/home/home.service.ts");
var HomeModule = (function () {
    function HomeModule() {
    }
    return HomeModule;
}());
HomeModule = __decorate([
    core_1.NgModule({
        imports: [shared_module_1.SharedModule.forRoot(),
            router_1.RouterModule.forChild(home_router_1.rootRouterConfig)
        ],
        declarations: [home_component_1.HomeComponent, apphome_component_1.AppHomeComponent, about_component_1.AboutComponent, contact_component_1.ContactComponent,
            homelist_component_1.HomeListComponent, applist_component_1.AppListComponent, list_component_1.ListComponent,
            homedetail_component_1.HomeDetailComponent, detail_component_1.DetailComponent, app_detail_component_1.AppDetailComponent],
        providers: [home_service_1.HomeService]
    }),
    __metadata("design:paramtypes", [])
], HomeModule);
exports.HomeModule = HomeModule;


/***/ },

/***/ "./src/app/home/home.router.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var detail_component_1 = __webpack_require__("./src/app/home/detail/detail.component.ts");
var home_component_1 = __webpack_require__("./src/app/home/home.component.ts");
var app_detail_component_1 = __webpack_require__("./src/app/home/detail/app.detail.component.ts");
var apphome_component_1 = __webpack_require__("./src/app/home/apphome.component.ts");
var homelist_component_1 = __webpack_require__("./src/app/home/list/homelist.component.ts");
var homedetail_component_1 = __webpack_require__("./src/app/home/detail/homedetail.component.ts");
var applist_component_1 = __webpack_require__("./src/app/home/list/applist.component.ts");
var about_component_1 = __webpack_require__("./src/app/home/about/about.component.ts");
var contact_component_1 = __webpack_require__("./src/app/home/contact/contact.component.ts");
var my_data_resolver_1 = __webpack_require__("./src/app/common/my-data-resolver.ts");
var page_animate_guard_1 = __webpack_require__("./src/app/common/page-animate-guard.ts");
exports.rootRouterConfig = [
    //  { path: '', redirectTo: 'list', pathMatch: 'full' },
    //  {
    // path: "", children: [ // 订单管理系统
    // {
    //   path: '', component: AppHomeComponent, children: [
    //     { path: 'list', component: HomeListComponent },
    //     { path: 'detail0', component: HomeDetailComponent },
    //     { path: 'detail', component: HomeDetailComponent, outlet: 'bottom' }
    //   ]
    // },
    // {
    //   path: ":li", component: HomeComponent, children: [
    //     {
    //       path: '', component: HomeListComponent, pathMatch: 'full'
    //     },
    //     { path: ':id', component: DetailComponent },
    //     { path: ":id", component: HomeDetailComponent, outlet: "bottom" }
    //     // {
    //     //   path: 'detail/:id', children: [
    //     //     { path: "", component: HomeDetailComponent, outlet: "bottom" }
    //     //   ]
    //     // }
    //   ]
    // },
    // {
    //   path: ":li", component: HomeComponent, outlet: "bottom", children: [
    //     { path: 'detail11', component: DetailComponent },
    //     { path: "detail12", component: HomeDetailComponent, outlet: "bottom" }
    //   ]
    // },
    {
        path: "", component: home_component_1.HomeComponent, children: [
            { path: "", redirectTo: "list", pathMatch: 'full' },
            {
                path: "list", component: homelist_component_1.HomeListComponent
            },
            // { path: "", redirectTo: 'detail55/55', pathMatch: 'full' },
            {
                path: "", component: homedetail_component_1.HomeDetailComponent, outlet: "bottom", canActivate: [page_animate_guard_1.CanPageAnimateGuard],
                resolve: { default: my_data_resolver_1.MyDataResolver }
            }
        ]
    },
    {
        path: '', component: apphome_component_1.AppHomeComponent, children: [
            { path: 'detail3', component: homedetail_component_1.HomeDetailComponent, outlet: 'primary' },
            { path: 'detail5', component: homedetail_component_1.HomeDetailComponent, outlet: 'bottom' }
        ]
    },
    {
        path: 'list2', component: applist_component_1.AppListComponent, children: [
            { path: '', redirectTo: 'detail0', pathMatch: 'full' },
            { path: 'detail0', component: detail_component_1.DetailComponent },
            { path: 'detail', component: detail_component_1.DetailComponent, outlet: 'bottom' }
        ]
    },
    { path: 'detail0', component: app_detail_component_1.AppDetailComponent },
    { path: 'detail', component: app_detail_component_1.AppDetailComponent, outlet: 'right' },
    { path: 'detail2', component: app_detail_component_1.AppDetailComponent, outlet: 'bottom' },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'contact', component: contact_component_1.ContactComponent },
    { path: 'contact2', component: contact_component_1.ContactComponent, outlet: 'bottom', },
];


/***/ },

/***/ "./src/app/home/list/applist.component.ts":
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
var AppListComponent = (function () {
    function AppListComponent() {
    }
    AppListComponent.prototype.ngOnInit = function () { };
    return AppListComponent;
}());
AppListComponent = __decorate([
    core_1.Component({
        selector: 'applist',
        template: "\n        <h2>App list page</h2>\n         <router-outlet></router-outlet>\n        <router-outlet name = \"bottom\"></router-outlet>\n    "
    }),
    __metadata("design:paramtypes", [])
], AppListComponent);
exports.AppListComponent = AppListComponent;


/***/ },

/***/ "./src/app/home/list/homelist.component.ts":
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
var home_service_1 = __webpack_require__("./src/app/services/home/home.service.ts");
var Rx_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
__webpack_require__("./node_modules/rxjs/add/operator/withLatestFrom.js");
var HomeListComponent = (function () {
    function HomeListComponent(homeService) {
        this.homeService = homeService;
        this.textEmitter = new Rx_1.Subject();
        this.text1 = new Rx_1.BehaviorSubject("6");
        this.text2 = new Rx_1.BehaviorSubject("6");
    }
    HomeListComponent.prototype.ngOnInit = function () {
        var _this = this;
        Rx_1.Observable.combineLatest(this.text1, this.text2)
            .subscribe(function (values) {
            _this.report = _this.homeService
                .getReport(+values[0], +values[1]);
        });
        this.text$ = this.textEmitter
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (v) { return _this.getDataAsync(v); });
        this.text$.subscribe(function (value) {
            console.log(value);
        });
        this.result$ = Rx_1.Observable.combineLatest(this.text1, this.text2).map(function (values) {
            return values[0] + " " + values[1];
        });
    };
    HomeListComponent.prototype.keyup = function (value) {
        this.textEmitter.next(value);
    };
    HomeListComponent.prototype.getDataAsync = function (value) {
        var _this = this;
        var subject = new Rx_1.Subject();
        setTimeout(function () {
            console.log("after 2second");
            _this.homeService.getReport(+value, +value).subscribe(subject);
            // subject.next(value + " final");
        }, 2000);
        return subject;
    };
    return HomeListComponent;
}());
HomeListComponent = __decorate([
    core_1.Component({
        selector: 'homelist',
        template: "\n        <h2>home list page</h2>\n        <input type=\"text\" #input (keyup)=\"keyup(input.value)\" />\n        <pre>{{ text$ | async | json }}</pre>\n        <input type=\"text\" #input1 (keyup)=\"text1.next(input1.value)\" />\n        <input type=\"text\" #input2 (keyup)=\"text2.next(input2.value)\" /> \n        {{ result$ | async }}\n        <pre>{{report | async | json}}</pre>\n        <h2><a [routerLink]=\"['../',{outlets:{bottom:'detail/3'}}]\"> detail </a> </h2>\n        <h2> <a [routerLink]=\"[{outlets:{bottom:null}}]\"> Back</a></h2>\n         <router-outlet></router-outlet>\n        <router-outlet name = \"bottom\"></router-outlet>\n    "
    }),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeListComponent);
exports.HomeListComponent = HomeListComponent;


/***/ },

/***/ "./src/app/home/list/list.component.ts":
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
var home_service_1 = __webpack_require__("./src/app/services/home/home.service.ts");
var ListComponent = (function () {
    function ListComponent(homeService) {
        this.homeService = homeService;
    }
    ListComponent.prototype.ngOnInit = function () {
        this.report = this.homeService.getReport(6, 6);
    };
    return ListComponent;
}());
ListComponent = __decorate([
    core_1.Component({
        selector: 'list',
        template: "\n        <h2>list page</h2>\n        <h2>list page</h2>\n        <h2>list page</h2>\n        <h2>list page</h2>\n        <h2>list page</h2>\n        <h2>report | async | json</h2>\n         <router-outlet></router-outlet>\n         listrouter\n        <router-outlet name = \"bottom\"></router-outlet>\n        listrouter\n    "
    }),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], ListComponent);
exports.ListComponent = ListComponent;


/***/ },

/***/ "./src/app/services/home/home.service.ts":
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
var http_service_1 = __webpack_require__("./src/app/services/http.service.ts");
var HomeService = (function () {
    function HomeService(httpService) {
        this.httpService = httpService;
    }
    HomeService.prototype.getReport = function (reportId, rootId) {
        var apiUrl = "http://localhost:5000/api/Reports/GetReport";
        return this.httpService.httpPostWithNoBlock({ playload: [{ ReportId: reportId, RootId: rootId }] }, apiUrl);
    };
    return HomeService;
}());
HomeService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], HomeService);
exports.HomeService = HomeService;


/***/ }

});