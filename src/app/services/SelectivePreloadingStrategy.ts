import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tryGetValue } from '../untils/type-checker';
import { IModuleRef } from '../Models/IModuleRef';
import { AppGlobalService } from './AppGlobalService';


export interface IMoudleInfo {
    key: string;
    loader: () => Observable<any>;
    counter: number;
    route: Route
}
/**
 * 预加载策略
 */
@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
    /**
     *
     */
    constructor(private appGlobalService: AppGlobalService) {

    }
    private _moduleInfos: IMoudleInfo[] = [];
    private _maxCounter: number;

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        //当路由中配置data: {preload: true}时预加载
        let moduleInfo = this._moduleInfos.find(v => v.key === route.path);
        if (moduleInfo) {
            moduleInfo.counter += 1;
            moduleInfo.route = route;
            this._maxCounter = moduleInfo.counter;
        } else {
            let moduleId = route.data && route.data.moduleId || route.path;
            this._moduleInfos.push({ key: moduleId, loader: load, counter: 1, route: route });
            this._maxCounter = 1;
        }
        let hasPreload = tryGetValue(() => route.data.preload).value;
        return hasPreload ? load() : of(null);
    }

    get moduleInfos() {
        return this._moduleInfos;
    }

    get notLoadedModuleInfos() {
        return this._moduleInfos.filter(v => v.counter == this._maxCounter);
    }

    getModuleInfo(key: string) {
        return this._moduleInfos.find(v => v.key === key);
    }

    loadModule(moduleId: string, subscribe?: (moduleRef: IModuleRef) => void, runOnce: boolean = true) {
        let moduleInfo = this.notLoadedModuleInfos.find(m => m.key === moduleId);
        moduleInfo && moduleInfo.loader().subscribe();
        if (subscribe) {
            return this.appGlobalService.observeModule(moduleId, subscribe, runOnce);
        }
        return () => { };
    }
    loadModuleAsObservable(moduleId: string) {
        let moduleInfo = this.notLoadedModuleInfos.find(m => m.key === moduleId);
        moduleInfo && moduleInfo.loader().subscribe();
        return this.appGlobalService.getModuleObservable(moduleId);
    }
}