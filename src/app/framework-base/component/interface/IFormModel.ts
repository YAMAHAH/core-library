import { ComponentRef } from '@angular/core';
import { PageViewer } from '@framework-common/page-viewer/page-viewer';
import { Form } from '@framework-components/form/form';
import { IComponentFactoryContainer } from '@framework-base/component/interface/IComponentFactoryContainer';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { PageTypeEnum } from '../PageTypeEnum';
export interface IPageModel {
    /**
     * 主键
     */
    key?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 活动
     */
    active: boolean;
    /** 
     * 父亲
     */
    parent?: IPageModel;
    /**
     * 干爹
     */
    godFather?: IPageModel;
    views?: { current: any; pageViewerRef: ComponentRef<PageViewer>; modelRef: ComponentRef<Form>; tabViewRef: any; }
    /**
     * 儿子
     */
    childs?: IPageModel[];
    /**
     * 层次
     */
    level?: number;
    /**
     * 附加数据对象
     */
    tag?: any;
    /**
     * 附加对象2
     */
    extras?: any;
    /**
     * 元素引用
     */
    elementRef?: HTMLElement;
    /**
     * 主视图的父容器
     */
    mainViewContainerRef?: Node;
    /**
     * 弹窗实例引用
     */
    modalRef?: ComponentRef<Form>;
    /**
     * 页面查看器引用
     */
    pageViewerRef?: ComponentRef<PageViewer>;
    /**
     * 组件工厂引用
     */
    componentFactoryRef?: IComponentFactoryContainer;
    /**
     * 组件引用
     */
    componentRef?: ComponentRef<any>;
    /**
     * 关闭前检查回调
     */
    closeBeforeCheckFn?: Function;
    /**
     * 关闭后回调
     */
    closeAfterFn?: Function;
    /**
     * 全局管理
     */
    globalManager?: AppGlobalService;
    /**
     * 页面类型
     */
    formType?: PageTypeEnum;
    /**
     * 页面显示类型
     */
    showType?: ShowTypeEnum;
    /**
     * 数据提供解析
     */
    resolve?: any;
}