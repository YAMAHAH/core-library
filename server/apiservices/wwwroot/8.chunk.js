webpackJsonp([8,10],{

/***/ "./src/app/static-news/childnews.component.ts":
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
var ChildNewsComponent = (function () {
    function ChildNewsComponent() {
        this.test$ = Observable_1.Observable.timer(1000, 1000);
    }
    ChildNewsComponent.prototype.ngOnInit = function () { };
    return ChildNewsComponent;
}());
ChildNewsComponent = __decorate([
    core_1.Component({
        selector: 'childnews',
        template: "\n        <h2>ChildNewsComponent page {{test$ | async}}</h2>\n    "
    }),
    __metadata("design:paramtypes", [])
], ChildNewsComponent);
exports.ChildNewsComponent = ChildNewsComponent;


/***/ },

/***/ "./src/app/static-news/staticnews.component.ts":
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
var StaticNewsComponent = (function () {
    function StaticNewsComponent() {
        this.test$ = Observable_1.Observable.timer(1000, 1000);
    }
    StaticNewsComponent.prototype.ngOnInit = function () { };
    return StaticNewsComponent;
}());
StaticNewsComponent = __decorate([
    core_1.Component({
        selector: 'staticnews',
        template: "\n        <h2>StaticNews page for Jit {{test$ | async}}</h2>\n    "
    }),
    __metadata("design:paramtypes", [])
], StaticNewsComponent);
exports.StaticNewsComponent = StaticNewsComponent;


/***/ },

/***/ "./src/app/static-news/staticnews.module.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var staticnews_router_1 = __webpack_require__("./src/app/static-news/staticnews.router.ts");
var staticnews_component_1 = __webpack_require__("./src/app/static-news/staticnews.component.ts");
var childnews_component_1 = __webpack_require__("./src/app/static-news/childnews.component.ts");
var StaticNewsModule = (function () {
    function StaticNewsModule() {
    }
    return StaticNewsModule;
}());
StaticNewsModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule,
            router_1.RouterModule.forChild(staticnews_router_1.rootRouterConfig)
        ],
        declarations: [staticnews_component_1.StaticNewsComponent, childnews_component_1.ChildNewsComponent],
        exports: [staticnews_component_1.StaticNewsComponent, childnews_component_1.ChildNewsComponent]
    }),
    __metadata("design:paramtypes", [])
], StaticNewsModule);
exports.StaticNewsModule = StaticNewsModule;


/***/ },

/***/ "./src/app/static-news/staticnews.router.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var staticnews_component_1 = __webpack_require__("./src/app/static-news/staticnews.component.ts");
var childnews_component_1 = __webpack_require__("./src/app/static-news/childnews.component.ts");
exports.rootRouterConfig = [
    { path: '', component: staticnews_component_1.StaticNewsComponent },
    { path: 'childNews/:id', component: childnews_component_1.ChildNewsComponent, outlet: "bottom" }
];


/***/ }

});