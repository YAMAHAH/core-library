import { Input } from '@angular/core';
import { KeyBindingDirective } from '@framework-common/directives/key-binding';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '@framework-dynamic-forms/models/field-config.interface';
import { Field } from '@framework-dynamic-forms/models/field.interface';
import { FlexItemDirective } from '@framework-common/directives/flex-item.directive';
import { FlexLayoutDirective } from '@framework-common/directives/flex-layout.directive';
export class FormSelectComponent implements Field {

    config: FieldConfig;
    group: FormGroup;
    keyBinding: KeyBindingDirective;
    flexItem: FlexItemDirective;
    flexContainer: FlexLayoutDirective;
    onMousemoveHandler(event) {
        if (this.readonly)
            event.target.setCapture();
    }
    onMouseoutHandler(event) {
        if (this.readonly)
            event.target.releaseCapture();
    }
    onFocusHandler(event) {
        if (this.readonly)
            event.target.blur();
    }

    private _readOnly: boolean;
    @Input() get readonly() {
        return this._readOnly;
    }
    set readonly(value) {
        this._readOnly = value;
    }

    private _focus = false;
    @Input() get focus() {
        return this._focus;
    }
    set focus(value) {
        if (this._focus! = value) {
            this._focus = value;
            if (value)
                this.controlFocus();
        }
    }

    controlFocus() {
        throw Error('该方法未实现');
    }
    constructor(public elementRef: ElementRef2) {

    }
}