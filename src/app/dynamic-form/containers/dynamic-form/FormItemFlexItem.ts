
import { Directive, Input } from '@angular/core';
import { FlexLayoutItem, FlexAlignItems, FlexJustifyContent, FlexWrap, FlexDirection } from '@framework-models/flex-layout-item';
import { NgStyleType } from '@untils/style-transforms';
import { FlexItem, FlexItemAlignSelf } from '@framework-models/flex-item';

type EventArgs = { target: any, propertyKey?: PropertyKey, currentValue?: any, oldValue?: any };

@Directive({
    selector: 'gx-form-item-flex-item',
    inputs: ['left', 'right', 'top', 'bottom']
})
export class FormItemFlexItem {

    left: string;
    right: string;
    top: string;
    bottom: string;

    /**fxItem*/

    @Input('order') order: number;
    @Input('grow') flexGrow: string = '0';
    @Input('shrink') flexShrink: string = '1';
    @Input('basis') flexBasis: string = "auto";
    // 绝对Flex项目的宽度只基于flex属性(0)时会自动分配剩余空间)，而相对Flex项目的宽度基于内容大小(auto)
    @Input('align') alignSelf: FlexItemAlignSelf;
    @Input() flex: string = '0 1 auto'; // auto:1 1 auto none: 0 0 auto; 1 0 0
    /**
     * 主轴跨距
     */
    @Input() span: number = 0;
    /**
     * 主轴偏移
     */
    @Input() offset: number;
    @Input() xs: FlexItem;
    @Input('gt-xs') gtxs: FlexItem;
    @Input('lt-sm') ltsm: FlexItem;

    @Input() sm: FlexItem;

    @Input('gt-sm') gtsm: FlexItem;

    @Input('lt-md') ltmd: FlexItem
    @Input() md: FlexItem;

    @Input('gt-md') gtmd: FlexItem;
    @Input('lt-lg') ltlg: FlexItem;

    @Input() lg: FlexItem;

    @Input('gt-lg') gtlg: FlexItem;

    @Input('lt-xl') ltxl: FlexItem;

    @Input() xl: FlexItem;

    @Input() fill: boolean;

    @Input('height') fxItemHeight: string;
    @Input('width') fxItemWidth: string;
    @Input('maxHeight') fxItemMaxHeight: string;
    @Input('maxWidth') fxItemMaxWidth: string;
    @Input('minHeight') fxItemMinHeight: string;
    @Input('minWidth') fxItemMinWidth: string;
    @Input('gap') fxItemGap: string | object;
    @Input('show') show: boolean
    @Input('class') fxItemClass: string | string[] | object
    @Input('style') fxItemStyle: NgStyleType;
    @Input('display') display: string;


}