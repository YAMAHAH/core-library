
import { Directive, Input } from '@angular/core';
import { FlexLayoutItem, FlexAlignItems, FlexJustifyContent, FlexWrap, FlexDirection } from '@framework-models/flex-layout-item';
import { NgStyleType } from '@untils/style-transforms';
import { FlexItem, FlexItemAlignSelf } from '@framework-models/flex-item';

type EventArgs = { target: any, propertyKey?: PropertyKey, currentValue?: any, oldValue?: any };

@Directive({
    selector: 'gx-form-item-flex-layout',
    inputs: ['width', 'height', 'flexBasic', 'left', 'right', 'top', 'bottom']
})
export class FormItemFlexLayout {

    width: string;
    height: string;
    flexBasic: number;
    left: string;
    right: string;
    top: string;
    bottom: string;

    /** fxlayout */
    @Input() direction: FlexDirection;
    @Input('flow') flow: string;
    @Input('wrap') wrap: FlexWrap = 'nowrap';
    @Input('alignMain') justifyContent: FlexJustifyContent = 'flex-start';
    @Input('alignCross') alignItems: FlexAlignItems = 'stretch';
    @Input('alignContent') alignContent: FlexAlignItems = 'stretch';
    @Input() gridColumns: number = 24;
    @Input('gutter') gutter: number | string | object;
    @Input('gap') gap: string | object;
    @Input('fill') fill: boolean;
    @Input('itemWidth') fxWidth: string;
    @Input('itemHeight') fxHeight: string;
    @Input('itemMinHeight') minHeight: string;
    @Input('itemMinWidth') minWidth: string;
    @Input('itemMaxHeight') maxHeight: string;
    @Input('itemMaxWidth') maxWidth: string;
    @Input('childItemClass') class: string | string[] | object;
    @Input('childItemStyle') style: NgStyleType = '';
    @Input('itemClass') itemClass: string | string[] | object;
    @Input('itemStyle') itemStyle: NgStyleType = '';
    @Input('forceFlex') fxForceFlex: boolean;
    @Input('xs') xs: FlexLayoutItem;
    @Input('gt-xs') gtxs: FlexLayoutItem;
    @Input('lt-sm') ltsm: FlexLayoutItem;
    @Input('sm') sm: FlexLayoutItem;
    @Input('gt-sm') gtsm: FlexLayoutItem;
    @Input('lt-md') ltmd: FlexLayoutItem;
    @Input('md') md: FlexLayoutItem;
    @Input('gt-md') gtmd: FlexLayoutItem;
    @Input('lt-lg') ltlg: FlexLayoutItem;
    @Input('lg') lg: FlexLayoutItem;
    @Input('gt-lg') gtlg: FlexLayoutItem;
    @Input('lt-xl') ltxl: FlexLayoutItem;
    @Input('xl') xl: FlexLayoutItem;
}