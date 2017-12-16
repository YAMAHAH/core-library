import { Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges, SimpleChange, OnInit, OnDestroy, Injector, SecurityContext, KeyValueDiffers } from '@angular/core';
import { NgStyleType, ngStyleUtils, NgStyleRawList, NgStyleSanitizer, NgStyleMap } from '@untils/style-transforms';
import { FlexDirection, FlexWrap, FlexJustifyContent, FlexAlignItems, FlexLayoutItem } from '@framework-models/flex-layout-item';
import { Subscription } from 'rxjs/Subscription';
import { MediaMonitor } from '@framework-services/mediaquery/media-monitor';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DomHandler } from '@framework-common/dom/domhandler';
import { DomSanitizer } from '@angular/platform-browser';
import { FxStyle } from './fxstyle';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs/Subject';

type EventArgs = { target: any, propertyKey?: PropertyKey, currentValue?: any, oldValue?: any };
let nextUniqueId = 0;

@Directive({
    selector: '[fxLayout],fxLayout'
})
export class FlexLayoutDirective implements OnChanges, OnInit, OnDestroy, DoCheck {

    _fxStyleInstance: FxStyle;
    ngDoCheck(): void {
        this._fxStyleInstance.ngDoCheck();
    }
    ngOnDestroy(): void {
        this.mediaMonitorSubscribtion.unsubscribe();
    }
    private mediaMonitorSubscribtion: Subscription;
    activeMedials: string[] = [];
    private _inited: boolean = false;

    ngOnInit(): void {
        this.mediaMonitorSubscribtion = this.mediaMonitor.observe()
            .pipe(
            filter(c => c.matches),
            distinctUntilChanged(),
            debounceTime(600))
            .subscribe(c => {
                this.activeMedials = this.globalService
                    .activeBreakPoints.map(bp => bp.alias) || [];
                this._updateWithValue();
            });
        this._inited = true;
    }
    private changeKeys: string[] = [
        'direction', 'wrap', 'justifyContent', 'alignItems', 'alignContent',
        'gridColumns', 'gutter', 'itemClass', 'itemStyle'
    ];
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let name: string;
                let value: SimpleChange = changes[key];
                if (this.changeKeys.contains(key)) {
                    let eventArgs: EventArgs = {
                        target: this,
                        propertyKey: key,
                        currentValue: value.currentValue,
                        oldValue: value.previousValue
                    };
                    this._updateWithValue(eventArgs);
                }
            }
        }
    }
    private elementRef: ElementRef;
    private mediaMonitor: MediaMonitor;
    private globalService: AppGlobalService;
    private renderer: Renderer2;
    protected domHandler: DomHandler;
    protected _sanitizer: DomSanitizer;
    private _differs: KeyValueDiffers;
    constructor(
        private injector: Injector
    ) {
        this.elementRef = injector.get(ElementRef);
        this.mediaMonitor = injector.get(MediaMonitor);
        this.globalService = injector.get(AppGlobalService);
        this.renderer = injector.get(Renderer2);
        this.domHandler = injector.get(DomHandler);
        this._sanitizer = injector.get(DomSanitizer);
        this._differs = this.injector.get(KeyValueDiffers);
        this._fxStyleInstance = new FxStyle(this._differs, this.elementRef, this.renderer);

        this.createHostProxy(this, null,
            () => {
                this._updateWithValue();
            });
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
        this.itemFlexContainerClassMap['display'] = 'flex';
        this.renderer.addClass(this.targetEl, this.itemflexContainerClassName);
    }
    private responsiveDataMap: Map<string, FlexLayoutItem> = new Map<string, FlexLayoutItem>();
    getMediaQueryData(actionFn: (item: FlexLayoutItem) => boolean, autoBreak: boolean = true) {
        for (let index = 0; index < this.activeMedials.length; index++) {
            let itemKey = this.activeMedials[index];
            let itemEntry = this.responsiveDataMap.get(itemKey);
            if (itemEntry && actionFn) {
                if (actionFn(itemEntry) && autoBreak) break;
            }
        }
    }
    private createTargetProxy(target: any,
        beforeAction?: (eventArgs?: EventArgs) => void,
        afterAction?: (eventArgs?: EventArgs) => void, prototypeTarget: any = null) {
        let handler = () => {
            let _self = this;
            let listenProps = [
                "wrap", "direction", "fill", "width", "justifyContent", "alignItems",
                "height", "gap", "style", "class", "alignContent", 'gutter', 'gridColumns', 'itemStyle', "itemClass"
            ];
            return {
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (typeof propertyKey === 'string') {
                        let findIndex = listenProps.contains(propertyKey);
                        if (findIndex) {
                            let oldValue = target[propertyKey];
                            let eArgs = { target, propertyKey, currentValue: value, oldValue };
                            if (oldValue != value) {
                                if (beforeAction) beforeAction(eArgs);
                                let res = Reflect.set(target, propertyKey, value, receiver);
                                console.log(`绑定对象属性值变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                                if (afterAction) afterAction(eArgs);
                                return res;
                            }
                        } else {
                            return Reflect.set(target, propertyKey, value, receiver);
                        }
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                }
            };
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler());
        prototypeTarget ? Object.setPrototypeOf(prototypeTarget, proxy) : Object.setPrototypeOf(target, proxy);
        return proxy;
    }
    simpleChangeUpdate$: Subject<EventArgs> = new Subject<EventArgs>();
    private createHostProxy(target: any,
        beforeAction?: (eventArgs?: EventArgs) => void,
        afterAction?: (eventArgs?: EventArgs) => void) {
        let handler = () => {
            let listenProps = [
                "xs", 'gtxs',
                'ltsm', "sm", 'gtsm',
                'ltmd', "md", 'gtmd',
                'ltlg', "lg", 'gtlg',
                'ltxl', "xl"
            ];
            let _self = this;
            return {
                get: function (target: any, propertyKey: PropertyKey, receiver: any) {
                    return Reflect.get(target, propertyKey, receiver);
                },
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (typeof propertyKey === 'string') {
                        let findIndex = listenProps.contains(propertyKey);
                        let hasChangeIndex = _self._inited && _self.changeKeys.contains(propertyKey);
                        if (findIndex || hasChangeIndex) {
                            let oldValue = target[propertyKey];
                            let eArgs = { target, propertyKey, currentValue: value, oldValue };
                            if (oldValue != value) {
                                if (findIndex && beforeAction) beforeAction(eArgs);
                                let res = Reflect.set(target, propertyKey, value, receiver);
                                console.log(`绑定对象变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                                if (findIndex && afterAction) afterAction(eArgs);
                                if (hasChangeIndex) _self.simpleChangeUpdate$.next(eArgs);
                                return res;
                            }
                        }
                        else {
                            return Reflect.set(target, propertyKey, value, receiver);
                        }
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                }
            };
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler());
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
    mediaItemSetterHandler(key: string, newValue: FlexLayoutItem) {
        // if (newValue) {
        //     let srcObj = newValue['data'] || newValue;
        //     if (!this.responsiveDataMap.has(key))
        //         this.responsiveDataMap.set(key, new FlexLayoutItem());
        //     let oldValue = this.responsiveDataMap.get(key);
        //     Object.assign(oldValue, srcObj);
        //     if (!(srcObj instanceof FlexLayoutItem))
        //         Object.setPrototypeOf(srcObj, Object.getPrototypeOf(oldValue));

        //     this.createTargetProxy(srcObj,
        //         (e) => {
        //             oldValue[e.propertyKey] = e.currentValue;
        //         }, (e) => {
        //             this._updateWithValue(e);
        //         });
        // }
        let storeValue = this.responsiveDataMap.get(key);
        if (newValue && newValue != storeValue) {
            let target = newValue['data'] || newValue;
            if (!storeValue) {
                storeValue = new FlexLayoutItem();
                this.responsiveDataMap.set(key, storeValue);
            }
            Object.assign(storeValue, target);
            if (!(target instanceof FlexLayoutItem)) {
                let temp = FlexLayoutItem.create(target);
                this.CreateInstanceProxy(temp, storeValue, target);
                this.deleteTargetProperty(target);
            } else {
                this.CreateInstanceProxy(target, storeValue);
            }
        }
    }
    private CreateInstanceProxy(target: any, storeValue: any, prototypeTarget: any = null) {
        this.createTargetProxy(target,
            (e) => {
                storeValue[e.propertyKey] = e.currentValue;
            }, (e) => {
                this._updateWithValue(e);
            }, prototypeTarget);
    }
    private deleteTargetProperty(target: any) {
        if (!target) return;
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                delete target[key];
            }
        }
    }

    itemFlexContainerClassMap = {};
    fxLayoutDirectionProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'direction' || !!!event) {
            let name = 'flex-direction';
            let currValue = this.direction;
            this.getMediaQueryData(item => {
                if (item.direction) {
                    currValue = item.direction;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexDirection;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'row')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }
    fxLayoutWrapProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'wrap' || !!!event) {
            let name = 'flex-wrap';
            let currValue = this.wrap;
            this.getMediaQueryData(item => {
                if (item.wrap) {
                    currValue = item.wrap;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexWrap;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'nowrap')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }
    fxLayoutJustifyContentProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'justifyContent' || !!!event) {
            let name = 'justify-content';
            let currValue = this.justifyContent;
            this.getMediaQueryData(item => {
                if (item.justifyContent) {
                    currValue = item.justifyContent;
                    return true;
                }
            });
            let srcStyle = this.targetEl.style.justifyContent;
            if (this.hasDefaultOrEqual(srcStyle, currValue, 'flex-start')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }
    fxLayoutFlowProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'flow' || !!!event) {
            let name = 'flex-flow';
            let currValue = this.flow;
            this.getMediaQueryData(item => {
                if (item.flow) {
                    currValue = item.flow;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexFlow;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'row nowrap')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }
    fxLayoutAlignItemsProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'alignItems' || !!!event) {
            let name = 'align-items';
            let currValue = this.alignItems;
            this.getMediaQueryData(item => {
                if (item.alignItems) {
                    currValue = item.alignItems;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.alignItems;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'stretch')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }
    private hasDefaultOrEqual(srcValue: any, currValue: any, defaultValue: any) {
        if (srcValue === '' && (currValue && currValue.trim() === defaultValue || currValue == undefined || currValue == null || currValue == '')) return true;
        if (srcValue === currValue) return true;
        return false;
    }
    fxLayoutAlignContentProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'alignContent' || !!!event) {
            let name = 'align-content';
            let currValue = this.alignContent;
            this.getMediaQueryData(item => {
                if (item.alignContent) {
                    currValue = item.alignContent;
                    return true;
                }
            });
            let srcValue = this.targetEl.style.alignContent;
            if (this.hasDefaultOrEqual(srcValue, currValue, 'stretch')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
            this.itemFlexContainerClassMap[name] = currValue;
        }
    }

    oldClass = "";
    getElementClass(currClass: string, classData: any) {
        if (classData)
            if (Array.isArray(classData))
                currClass = (classData.join(' ') + " " + currClass).trim();
            else if (typeof classData === 'string')
                currClass = (classData + " " + currClass).trim();
            else {
                let addClasses: string[] = [];
                for (let key in classData) {
                    if (classData.hasOwnProperty(key)) {
                        if (classData[key])
                            addClasses.push(key);
                        else this.delClasses.push(key);
                    }
                }
                currClass = (addClasses.join(' ') + ' ' + currClass).trim();
            }
        return currClass;
    }
    delClasses: string[] = [];
    fxItemClassProcess(event?: EventArgs) {
        if (event && ['itemClass', 'itemClass'].contains(event.propertyKey as string) || !!!event) {
            let currClass = "";
            this.delClasses = [];
            let mediaList = this.activeMedials;
            for (let index = 0; index < mediaList.length; index++) {
                let mediaVal = mediaList[index];
                let entry = this.responsiveDataMap.get(mediaVal);
                if (entry && entry.itemClass)
                    currClass = this.getElementClass(currClass, entry.itemClass);
            }

            currClass = this.getElementClass(currClass, this.itemClass);

            if (currClass && currClass.length > 0) {
                currClass = currClass.replace(/^ +| +$/g, ""); //.split(/ +/g);
                this.domHandler.addMultipleClasses(this.elementRef.nativeElement, currClass);
            }
            if (this.delClasses.length > 0) {
                for (var index = 0; index < this.delClasses.length; index++) {
                    this.renderer.removeClass(this.elementRef.nativeElement, this.delClasses[index]);
                }
                this.delClasses = [];
            }
        }
    }
    fxItemStyleProcess(event?: EventArgs) {
        if (event && ['itemStyle', 'itemStyle'].contains(event.propertyKey as string) || !!!event) {
            let currStyle: NgStyleMap;
            let mediaList = this.activeMedials.reverse();
            for (let index = 0; index < mediaList.length; index++) {
                let mediaVal = mediaList[index];
                let entry = this.responsiveDataMap.get(mediaVal);
                if (entry && entry.itemStyle)
                    if (currStyle)
                        currStyle = Object.assign(currStyle, this._buildStyleMap(entry.itemStyle));
                    else
                        currStyle = this._buildStyleMap(entry.itemStyle);
            }
            if (this.itemStyle)
                currStyle = Object.assign(this._buildStyleMap(this.itemStyle), currStyle);

            if (this._fxStyleInstance) this._fxStyleInstance.ngStyle = currStyle;
        }
    }

    protected _buildStyleMap(styles: NgStyleType): NgStyleMap {
        let sanitizer: NgStyleSanitizer = (val: any) => {
            // Always safe-guard (aka sanitize) style property values
            return this._sanitizer.sanitize(SecurityContext.STYLE, val);
        };
        if (styles) {
            switch (ngStyleUtils.getType(styles)) {
                case 'string': return ngStyleUtils.buildMapFromList(ngStyleUtils.buildRawList(styles), sanitizer);
                case 'array': return ngStyleUtils.buildMapFromList(styles as NgStyleRawList, sanitizer);
                case 'set': return ngStyleUtils.buildMapFromSet(styles, sanitizer);
                default: return ngStyleUtils.buildMapFromSet(styles, sanitizer);
            }
        }
        return null;
    }
    getCurrentDirection() {
        let currDir = this.direction;
        this.getMediaQueryData(item => {
            if (item.direction) {
                currDir = item.direction;
                return true;
            }
        });
        return currDir;
    }
    fxLayoutGutterProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'gutter' || !!!event) {
            let currGutter = this.getItemGutter(event);
            let currDir = this.getCurrentDirection();
            if (typeof currGutter === 'number')
                if (['row', 'row-reverse'].contains(currDir)) {
                    //this.renderer.setStyle(this.targetEl, 'margin', `0px -${currGutter / 2}px`);
                    let currValue = `-${currGutter / 2}px`;
                    this.itemFlexContainerClassMap["margin-left"] = currValue;
                    this.itemFlexContainerClassMap["margin-right"] = currValue;
                    this.renderer.setStyle(this.targetEl, 'margin-left', currValue);
                    this.renderer.setStyle(this.targetEl, 'margin-right', currValue);
                } else if (['column', 'column-reverse'].contains(currDir)) {
                    //this.renderer.setStyle(this.targetEl, 'margin', `-${currGutter / 2}px 0px`);
                    let currValue = `-${currGutter / 2}px`;
                    this.itemFlexContainerClassMap["margin-top"] = currValue;
                    this.itemFlexContainerClassMap["margin-bottom"] = currValue;
                    this.renderer.setStyle(this.targetEl, 'margin-top', currValue);
                    this.renderer.setStyle(this.targetEl, 'margin-bottom', currValue);
                }
        }
    }

    createElementStyle(target, style: string) {
        let styleNode = this.renderer.createElement('style');
        styleNode.innerHTML = style;
        if (target) {
            this.renderer.appendChild(target, styleNode);
        }
        return () => this.renderer.removeChild(target, styleNode);
    }
    private itemflexContainerClassName = "gx-item-flex-container-" + nextUniqueId++;
    getElementStyleClass() {
        let classStyle = "." + this.itemflexContainerClassName + " { ";
        for (const key in this.itemFlexContainerClassMap) {
            const value = this.itemFlexContainerClassMap[key];
            classStyle += '\n' + key + ' :' + value + ' ;';
        }
        return classStyle += '\n' + '}';
    }

    private unRegistityStyle;
    private prevItemStyle;
    _updateWithValue(event?: EventArgs) {

        this.fxLayoutDirectionProcess(event);
        this.fxLayoutWrapProcess(event);
        this.fxLayoutFlowProcess(event);
        this.fxLayoutJustifyContentProcess(event);
        this.fxLayoutAlignItemsProcess(event);
        this.fxLayoutAlignContentProcess(event);
        this.fxLayoutGutterProcess(event);
        this.fxItemClassProcess(event);
        this.fxItemStyleProcess(event);
        this.getItemGap(event);
        this.getItemFill(event);
        this.getItemMinWidth(event);
        this.getItemWidth(event);
        this.getItemMaxWidth(event);
        this.getItemMinHeight(event);
        this.getItemHeight(event);
        this.getItemMaxHeight(event);
        this.getItemGridColumns(event);

        let currStyle = this.getElementStyleClass();
        if (currStyle != this.prevItemStyle) {
            if (this.unRegistityStyle) {
                this.unRegistityStyle();
            }
            this.unRegistityStyle = this.createElementStyle(this.targetEl, currStyle);
            this.prevItemStyle = currStyle;
        }

    }
    private getItemGutter(event?: EventArgs) {
        if (event && event.propertyKey === 'gutter' || !!!event) {
            let currGutter = this.gutter;
            this.getMediaQueryData(item => {
                if (item.gutter) {
                    currGutter = item.gutter;
                    return true;
                }
            });
            this._itemGutter = currGutter;
            return currGutter;
        }
    }
    private getItemGap(event?: EventArgs) {
        if (event && event.propertyKey === 'gap' || !!!event) {
            let currGap = this.gap;
            this.getMediaQueryData(item => {
                if (item.gap) {
                    currGap = item.gap;
                    return true;
                }
            });
            this._itemGap = currGap;
            return currGap;
        }
    }
    private getItemMinWidth(event?: EventArgs) {
        if (event && event.propertyKey === 'minWidth' || !!!event) {
            let currValue = this.minWidth;
            this.getMediaQueryData(item => {
                if (item.minWidth) {
                    currValue = item.minWidth;
                    return true;
                }
            });
            this._itemMinWidth = currValue;
            return currValue;
        }
    }
    private getItemWidth(event?: EventArgs) {
        if (event && event.propertyKey === 'width' || !!!event) {
            let currWidth = this.width;
            this.getMediaQueryData(item => {
                if (item.width) {
                    currWidth = item.width;
                    return true;
                }
            });
            this._itemWidth = currWidth;
            return currWidth;
        }
    }
    private getItemMaxWidth(event?: EventArgs) {
        if (event && event.propertyKey === 'maxWidth' || !!!event) {
            let currValue = this.maxWidth;
            this.getMediaQueryData(item => {
                if (item.maxWidth) {
                    currValue = item.maxWidth;
                    return true;
                }
            });
            this._itemMaxWidth = currValue;
            return currValue;
        }
    }
    private getItemHeight(event?: EventArgs) {
        if (event && event.propertyKey === 'height' || !!!event) {
            let currHeight = this.height;
            this.getMediaQueryData(item => {
                if (item.height) {
                    currHeight = item.height;
                    return true;
                }
            });
            this._itemHeight = currHeight;
            return currHeight;
        }
    }
    private getItemMinHeight(event?: EventArgs) {
        if (event && event.propertyKey === 'minHeight' || !!!event) {
            let currValue = this.minHeight;
            this.getMediaQueryData(item => {
                if (item.minHeight) {
                    currValue = item.minHeight;
                    return true;
                }
            });
            this._itemMinHeight = currValue;
            return currValue;
        }
    }
    private getItemMaxHeight(event?: EventArgs) {
        if (event && event.propertyKey === 'maxHeight' || !!!event) {
            let currValue = this.maxHeight;
            this.getMediaQueryData(item => {
                if (item.maxHeight) {
                    currValue = item.maxHeight;
                    return true;
                }
            });
            this._itemMaxHeight = currValue;
            return currValue;
        }
    }
    private getItemFill(event?: EventArgs) {
        if (event && event.propertyKey === 'fill' || !!!event) {
            let currFill = this.fill;
            this.getMediaQueryData(item => {
                if (item.fill) {
                    currFill = item.fill;
                    return true;
                }
            });
            this._itemFill = currFill;
            return currFill;
        }
    }
    private getItemGridColumns(event?: EventArgs) {
        if (event && event.propertyKey === 'gridColumns' || !!!event) {
            let currGridcols = this.gridColumns;
            this.getMediaQueryData(item => {
                if (item.gridColumns) {
                    currGridcols = item.gridColumns;
                    return true;
                }
            });
            this._itemGridColumns = currGridcols;
            return currGridcols;
        }
    }
    private get targetEl() {
        return this.elementRef && this.elementRef.nativeElement;
    }
    private _flexDirection: FlexDirection;
    @Input('fxLayout')
    get direction(): FlexDirection {
        return this._flexDirection || 'row';
    };
    set direction(value: FlexDirection) {
        this._flexDirection = value;
    }
    private _itemGutter: number | string | object;
    get itemGutter() {
        return this._itemGutter;
    }
    private _itemGap: string | object;
    get itemGap() {
        return this._itemGap;
    }
    private _itemFill: boolean;
    get itemFill() {
        return this._itemFill;
    }
    private _itemMinWidth: string;
    get itemMinWidth() {
        return this._itemMinWidth;
    }
    private _itemWidth: string;
    get itemWidth() {
        return this._itemWidth;
    }
    private _itemMaxWidth: string;
    get itemMaxWidth() {
        return this._itemMaxWidth;
    }
    private _itemHeight: string;
    get itemHeight() {
        return this._itemHeight;
    }
    private _itemMinHeight: string;
    get itemMinHeight() {
        return this._itemMinHeight;
    }
    private _itemMaxHeight: string;
    get itemMaxHeight() {
        return this._itemMaxHeight;
    }
    private _itemGridColumns: number;
    get itemGridColumns() {
        return this._itemGridColumns;
    }
    @Input('fxFlow') flow: string;
    @Input('fxWrap') wrap: FlexWrap = 'nowrap';

    @Input('fxAlignMain') justifyContent: FlexJustifyContent = 'flex-start';

    @Input('fxAlignCross') alignItems: FlexAlignItems = 'stretch';

    @Input('fxAlignContent') alignContent: FlexAlignItems = 'stretch';
    @Input() gridColumns: number = 24;

    @Input('fxGutter') gutter: number | string | object;
    @Input('fxGap') gap: string | object;
    private _fill: boolean = false;
    @Input('fxFill')
    get fill(): boolean {
        return this._fill;
    }
    set fill(value: boolean) {
        this._fill = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }
    @Input('fxWidth') width: string;
    @Input('fxHeight') height: string;
    @Input('fxMinHeight') minHeight: string;
    @Input('fxMinWidth') minWidth: string;
    @Input('fxMaxHeight') maxHeight: string;
    @Input('fxMaxWidth') maxWidth: string;
    @Input('fxClass') class: string | string[] | object;
    @Input('fxStyle') style: NgStyleType = '';

    @Input() itemClass: string | string[] | object;
    @Input() itemStyle: NgStyleType = '';

    private _forceFlex: boolean = false;
    @Input()
    get fxForceFlex(): boolean {
        return this._forceFlex;
    }
    set fxForceFlex(value: boolean) {
        this._forceFlex = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }

    @Input('fxLayout.xs')
    get xs(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xs');
        else return null;
    }
    set xs(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('xs', value);
    }
    @Input('fxLayout.gt-xs')
    get gtxs(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-xs');
        else return null;
    }
    set gtxs(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-xs', value);
    }
    @Input('fxLayout.lt-sm')
    get ltsm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-sm');
        else return null;
    }
    set ltsm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-sm', value);
    }

    @Input('fxLayout.sm')
    get sm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('sm');
        else return null;
    }
    set sm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('sm', value);
    }

    @Input('fxLayout.gt-sm')
    get gtsm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-sm');
        else return null;
    }
    set gtsm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-sm', value);
    }

    @Input('fxLayout.lt-md')
    get ltmd(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-md');
        else return null;
    }
    set ltmd(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-md', value);
    }
    @Input('fxLayout.md')
    get md(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('md');
        else return null;
    }
    set md(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('md', value);
    }
    @Input('fxLayout.gt-md')
    get gtmd(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-md');
        else return null;
    }
    set gtmd(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-md', value);
    }
    @Input('fxLayout.lt-lg')
    get ltlg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-lg');
        else return null;
    }
    set ltlg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-lg', value);
    }
    @Input('fxLayout.lg')
    get lg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lg');
        else return null;
    }
    set lg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lg', value);
    }
    @Input('fxLayout.gt-lg')
    get gtlg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-lg');
        else return null;
    }
    set gtlg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-lg', value);
    }
    @Input('fxLayout.lt-xl')
    get ltxl(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-xl');
        else return null;
    }
    set ltxl(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('ltxl', value);
    }
    @Input('fxLayout.xl')
    get xl(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xl');
        else return null;
    }
    set xl(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('xl', value);
    }
}