import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';


export class AppRouterReuseStrategy implements RouteReuseStrategy {

    _cacheRouters: { [key: string]: any } = {};

    /**
     * 路由离开时控制是否允许复用
     * 是否允许复用路由
     * @param route 
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //console.log(route.routeConfig.path);
        // 对所有路由允许复用
        return true;
    }
    /**
     * 
     * 当路由离开时会触发，存储路由
     * @param route 
     * @param handle 
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // 按path作为key存储路由快照&组件当前实例对象
        // path等同RouterModule.forRoot中的配置

        this._cacheRouters[route.routeConfig.path] = {
            snapshot: route,
            handle: handle
        };
    }
    /**
     * 
     * 是否允许还原路由
     * @param route 
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // 在缓存中有的都认为允许还原路由
        return !!route.routeConfig && !!this._cacheRouters[route.routeConfig.path];
    }
    /**
     * 获取存储路由
     * @param route 
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        // 从缓存中获取快照，若无则返回null
        if (!route.routeConfig || !this._cacheRouters[route.routeConfig.path]) return null;
        return this._cacheRouters[route.routeConfig.path].handle;
    }
    /**
     * 进入路由触发，是否同一路由时复用路由
     * @param future 
     * @param curr 
     */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // console.log(future);
        // console.log(curr);
        // 同一路由时复用路由
        return future.routeConfig === curr.routeConfig;
    }

}