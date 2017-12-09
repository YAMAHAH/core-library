webpackJsonp([0,10],{

/***/ "./node_modules/css-loader/index.js!./src/app/common/auth/login.component.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },

/***/ "./src/app/common/auth/auth.module.ts":
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
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var auth_router_1 = __webpack_require__("./src/app/common/auth/auth.router.ts");
var signup_1 = __webpack_require__("./src/app/common/auth/signup.ts");
var auth_service_1 = __webpack_require__("./src/app/common/auth/auth.service.ts");
var shared_module_1 = __webpack_require__("./src/app/common/shared/shared-module.ts");
var login_component_1 = __webpack_require__("./src/app/common/auth/login.component.ts");
var auth_guard_1 = __webpack_require__("./src/app/common/auth/auth.guard.ts");
var AuthModule = AuthModule_1 = (function () {
    function AuthModule() {
    }
    AuthModule.forRoot = function () {
        return {
            ngModule: AuthModule_1,
            providers: [auth_service_1.AuthService, auth_guard_1.AuthGuard]
        };
    };
    return AuthModule;
}());
AuthModule = AuthModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(auth_router_1.authRouterConfig),
            shared_module_1.SharedModule.forRoot()
        ],
        declarations: [
            login_component_1.LoginComponent, signup_1.Signup
        ]
    }),
    __metadata("design:paramtypes", [])
], AuthModule);
exports.AuthModule = AuthModule;
var AuthModule_1;


/***/ },

/***/ "./src/app/common/auth/auth.router.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var signup_1 = __webpack_require__("./src/app/common/auth/signup.ts");
var login_component_1 = __webpack_require__("./src/app/common/auth/login.component.ts");
exports.authRouterConfig = [
    { path: '', redirectTo: "login", pathMatch: "full" },
    { path: 'login', component: login_component_1.LoginComponent, data: { one: 'one' } },
    { path: 'signup', component: signup_1.Signup }
];


/***/ },

/***/ "./src/app/common/auth/auth.service.ts":
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
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var Rx_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
__webpack_require__("./node_modules/rxjs/add/operator/do.js");
__webpack_require__("./node_modules/rxjs/add/operator/delay.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var AuthService = (function () {
    function AuthService(http, router) {
        this.http = http;
        this.router = router;
        this.isLoggedIn = false;
        this.port = 9000;
        this.signupUrl = 'http://localhost:' + this.port + '/users';
        this.loginUrl = 'http://localhost:' + this.port + '/sessions/create';
        this.authError = new Rx_1.BehaviorSubject(null);
        this.userJoined = new Rx_1.BehaviorSubject(null);
        this.jwt = null;
        this.decodedJwt = null;
        this.isLoggedIn = false;
    }
    AuthService.prototype.logout = function (url) {
        if (url === void 0) { url = null; }
        this.isLoggedIn = false;
        localStorage.removeItem('jwt');
        this.jwt = null;
        this.decodedJwt = null;
        if (url)
            this.router.navigateByUrl(url);
    };
    AuthService.prototype.signup = function (username, password, avatar) {
        return this.post(this.signupUrl, username, password, 'avatar');
    };
    AuthService.prototype.login = function (username, password) {
        return this.post(this.loginUrl, username, password);
    };
    AuthService.prototype.post = function (url, username, password, avatar) {
        this.isLoggedIn = true;
        return Promise.resolve();
        // let body = JSON.stringify({ username, password, avatar });
        // let contentHeaders = new Headers();
        // contentHeaders.append('Accept', "application/json");
        // contentHeaders.append('Content-Type', 'application/json');
        // return this.http
        //     .post(url, body, { headers: contentHeaders })
        //     .toPromise()
        //     .then(response => {
        //         let userJson = response.json();
        //         this.isLoggedIn = true;
        //         this.jwt = userJson.id_token;
        //         localStorage.setItem('jwt', this.jwt);
        //     }, error => {
        //         this.authError.next(error.text());
        //     });
    };
    AuthService.prototype.relogin = function () {
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], AuthService);
exports.AuthService = AuthService;


/***/ },

/***/ "./src/app/common/auth/login.component.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/common/auth/login.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/common/auth/login.component.html":
/***/ function(module, exports) {

module.exports = "<a [routerLink]=\"['/mobile']\">MobileHome</a>\n<a [routerLink]=\"['/pc']\">PCHome</a>\n\n<div class=\"login center-block col-md-4 \">\n    <h1>登录</h1>\n    <form #f=\"ngForm\" (ngSubmit)=\"login($event,f)\">\n        <div ngModelGroup=\"credentials\" #ngName=\"ngModelGroup\" class=\"form-group\">\n            <label for=\"username\">用户</label>\n            <input type=\"text\" id='username' name='username' ngModel required class=\"form-control\" placeholder=\"Username\">\n            <label for=\"password\">密码</label>\n            <input type=\"password\" name='password' ngModel required class=\"form-control\" placeholder=\"Password\">\n        </div>\n        <button type=\"submit\" class=\"btn btn-default btn-primary\">登录</button>\n        <button (click)=\"signup($event)\" class=\"btn btn-success\">注册</button>\n    </form>\n    <pre>{{ngName?.valid ? \"valid\" : \"invaild\"}}</pre>\n    <pre>{{f.value | json}}</pre>\n</div>\n<!--<form #ff=\"ngForm\" (ngSubmit)=\"onSubimt(ff)\">\n    <input name=\"first\" ngModel required #first=\"ngModel\">\n    <input name=\"last\" ngModel>\n    <button>Sumbit</button>\n</form>-->"

/***/ },

/***/ "./src/app/common/auth/login.component.ts":
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
var auth_service_1 = __webpack_require__("./src/app/services/auth.service.ts");
var load_script_service_1 = __webpack_require__("./src/app/services/load-script-service.ts");
var LoginComponent = (function () {
    function LoginComponent(router, authService, loadScriptService, activeRoute) {
        var _this = this;
        this.router = router;
        this.authService = authService;
        this.loadScriptService = loadScriptService;
        this.activeRoute = activeRoute;
        this.defaultPage = '/pc';
        this.target = null;
        this.activeRoute
            .params
            .map(function (p) { return p['target']; })
            .subscribe(function (url) {
            if (url)
                _this.target = decodeURIComponent(url);
        });
    }
    LoginComponent.prototype.onSubmit = function (f) {
        console.log(f.value);
        return false;
    };
    LoginComponent.prototype.ngOnInit = function () {
        this.loadScriptService
            .loadBootstrapCSS
            .then(function (css) { });
    };
    LoginComponent.prototype.login = function (event, ngForm) {
        var _this = this;
        event.preventDefault();
        if (ngForm.valid) {
            this.authService
                .login(ngForm.value.credentials.username, ngForm.value.credentials.password)
                .then(function () {
                _this.router.navigateByUrl(_this.target ? _this.target : _this.defaultPage);
                return true;
            });
        }
        return false;
    };
    LoginComponent.prototype.signup = function (event) {
        event.preventDefault();
        this.router.navigateByUrl('/auth/signup');
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login',
        template: __webpack_require__("./src/app/common/auth/login.component.html"),
        styles: [__webpack_require__("./src/app/common/auth/login.component.css")]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        auth_service_1.AuthService,
        load_script_service_1.LoadScriptService,
        router_1.ActivatedRoute])
], LoginComponent);
exports.LoginComponent = LoginComponent;


/***/ },

/***/ "./src/app/common/auth/signup.html":
/***/ function(module, exports) {

module.exports = "<div class=\"center-block col-md-4\">\r\n    <h1>注册</h1>\r\n    <form #f=\"ngForm\" (ngSubmit)=\"signup($event, f.value.credentials.username, f.value.credentials.password)\">\r\n        <div ngModelGroup=\"credentials\" class=\"form-group\">\r\n            <label for=\"username\">用户</label>\r\n            <input type=\"text\" name='username' focus='true' ngModel required class=\"form-control\" placeholder=\"Username\">\r\n            <label for=\"password\">密码</label>\r\n            <input type=\"password\" name='password' ngModel required class=\"form-control\" placeholder=\"Password\">\r\n        </div>\r\n        <div ngModelGroup=\"person\" class=\"form-group\">\r\n            <p>First name: <input class=\"form-control\" type=\"text\" name=\"firstName\" ngModel></p>\r\n            <p>Last name: <input class=\"form-control\" type=\"text\" name=\"lastName\" ngModel></p>\r\n        </div>\r\n        <button type=\"submit\" class=\"btn btn-default btn-primary\">注册</button>\r\n        <button (click)=\"login($event)\" class=\"btn btn-success\">登录</button>\r\n    </form>\r\n    <pre>{{f.value | json }}</pre>\r\n</div>"

/***/ },

/***/ "./src/app/common/auth/signup.ts":
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
var auth_service_1 = __webpack_require__("./src/app/services/auth.service.ts");
var load_script_service_1 = __webpack_require__("./src/app/services/load-script-service.ts");
var Signup = (function () {
    function Signup(router, authService, loadScriptService) {
        this.router = router;
        this.authService = authService;
        this.loadScriptService = loadScriptService;
    }
    Signup.prototype.signup = function (event, username, password, avatar) {
        var _this = this;
        event.preventDefault();
        this.authService.signup(username, password).then(function () {
            _this.router.navigateByUrl('/pc');
        });
    };
    Signup.prototype.login = function (event) {
        event.preventDefault();
        this.router.navigateByUrl('/auth/login');
    };
    Signup.prototype.ngOnInit = function () {
        this.loadScriptService
            .loadBootstrapCSS
            .then(function (css) { });
    };
    return Signup;
}());
Signup = __decorate([
    core_1.Component({
        selector: 'signup',
        template: __webpack_require__("./src/app/common/auth/signup.html")
    }),
    __metadata("design:paramtypes", [router_1.Router,
        auth_service_1.AuthService,
        load_script_service_1.LoadScriptService])
], Signup);
exports.Signup = Signup;


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