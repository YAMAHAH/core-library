webpackJsonp([7,10],{

/***/ "./node_modules/css-loader/index.js!./src/app/news/news.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, "h2 {\n  color: skyblue;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 250%; }\n\nh3 {\n  color: #369;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 150%; }\n", ""]);

// exports


/***/ },

/***/ "./src/app/news/auxnews.component.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
// import { UrlResolver } from '@angular/compiler';
__webpack_require__("./node_modules/rxjs/add/observable/timer.js");
// let css: string = require('./news.css');
var AuxNewsComponent = (function () {
    function AuxNewsComponent(activateRouter) {
        this.activateRouter = activateRouter;
        this.test$ = Observable_1.Observable.timer(1000, 1000);
    }
    AuxNewsComponent.prototype.ngOnInit = function () {
    };
    return AuxNewsComponent;
}());
AuxNewsComponent = __decorate([
    core_1.Component({
        selector: 'auxnews',
        styles: [__webpack_require__("./src/app/news/news.css")],
        template: "\n        <ul><li *ngFor = \"let i of [1,2,3]\">{{i}}</li></ul>\n        <h2 style = \"display:block\">Aux news page for AOT {{test$ | async}}</h2>\n    "
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], AuxNewsComponent);
exports.AuxNewsComponent = AuxNewsComponent;


/***/ },

/***/ "./src/app/news/news.component.html":
/***/ function(module, exports) {

module.exports = "<ul>\r\n    <li *ngFor=\"let i of [1,2,3,4,5,6,8]\">{{i}}</li>\r\n</ul>\r\n<app-title [subtitle]=\"'NewTitle'\"></app-title>\r\n<h2 #mytest style=\"display:block\">news page for AOT {{test$ | async}}</h2>\r\n<pre>news Page for AOT {{result$ | async | json}}</pre>\r\n\r\n<input type=\"text\" #input (keyup)=\"keyup(input.value)\" />\r\n<pre>{{ text$ | async | json }}</pre>\r\n<p>version:{{version}}</p>"

/***/ },

/***/ "./src/app/news/news.component.ts":
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
// import { Observable, Subject } from 'rxjs/Rx';
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
// import { UrlResolver } from '@angular/compiler';
// const css: string = require('./news.css');
// require('./news.scss');
// export const style1: any = loadstyle();
// import css = require("./news.css");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
__webpack_require__("./node_modules/rxjs/add/observable/timer.js");
__webpack_require__("./node_modules/rxjs/add/observable/fromEvent.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
__webpack_require__("./node_modules/rxjs/add/operator/withLatestFrom.js");
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var news_service_1 = __webpack_require__("./src/app/services/news/news.service.ts");
var NewsComponent = (function () {
    function NewsComponent(activateRouter, newsService) {
        var _this = this;
        this.activateRouter = activateRouter;
        this.newsService = newsService;
        this.textEmitter = new Subject_1.Subject();
        this.test$ = Observable_1.Observable.timer(1000, 1000).map(function (x) { return x * 133; });
        var clicks$ = Observable_1.Observable.fromEvent(document, 'click');
        var timer$ = Observable_1.Observable.interval(1000); //clicks$.withLatestFrom(
        this.result$ = this.textEmitter
            .distinctUntilChanged()
            .switchMap(function (values) {
            console.log(values);
            return _this.newsService.getReport(+values, +values);
        });
    }
    NewsComponent.prototype.ngOnInit = function () {
        //  this.result$.subscribe(x => console.log(x));
    };
    NewsComponent.prototype.keyup = function (value) {
        this.textEmitter.next(value);
    };
    return NewsComponent;
}());
NewsComponent = __decorate([
    core_1.Component({
        selector: 'news',
        styles: [__webpack_require__("./src/app/news/news.css")],
        template: __webpack_require__("./src/app/news/news.component.html")
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, news_service_1.NewsService])
], NewsComponent);
exports.NewsComponent = NewsComponent;


/***/ },

/***/ "./src/app/news/news.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/news/news.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/news/news.module.ts":
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
var news_router_1 = __webpack_require__("./src/app/news/news.router.ts");
var news_component_1 = __webpack_require__("./src/app/news/news.component.ts");
var auxnews_component_1 = __webpack_require__("./src/app/news/auxnews.component.ts");
var shared_module_1 = __webpack_require__("./src/app/common/shared/shared-module.ts");
var news_service_1 = __webpack_require__("./src/app/services/news/news.service.ts");
var NewsModule = (function () {
    function NewsModule() {
    }
    return NewsModule;
}());
NewsModule = __decorate([
    core_1.NgModule({
        imports: [shared_module_1.SharedModule.forRoot(), router_1.RouterModule.forChild(news_router_1.rootRouterConfig)],
        declarations: [news_component_1.NewsComponent, auxnews_component_1.AuxNewsComponent],
        exports: [news_component_1.NewsComponent],
        providers: [news_service_1.NewsService]
    }),
    __metadata("design:paramtypes", [])
], NewsModule);
exports.NewsModule = NewsModule;


/***/ },

/***/ "./src/app/news/news.router.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var news_component_1 = __webpack_require__("./src/app/news/news.component.ts");
var auxnews_component_1 = __webpack_require__("./src/app/news/auxnews.component.ts");
exports.rootRouterConfig = [
    { path: '', component: news_component_1.NewsComponent },
    { path: 'auxnews', component: auxnews_component_1.AuxNewsComponent, outlet: 'bottom' },
    { path: 'news2', component: news_component_1.NewsComponent, outlet: 'bottom' }
];


/***/ },

/***/ "./src/app/services/news/news.service.ts":
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
var NewsService = (function () {
    function NewsService(httpService) {
        this.httpService = httpService;
    }
    NewsService.prototype.getReport = function (reportId, rootId) {
        var apiUrl = "http://localhost:5000/api/Reports/GetReport";
        return this.httpService.httpPostWithNoBlock({ playload: [{ ReportId: reportId, RootId: rootId }] }, apiUrl);
    };
    return NewsService;
}());
NewsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], NewsService);
exports.NewsService = NewsService;


/***/ }

});