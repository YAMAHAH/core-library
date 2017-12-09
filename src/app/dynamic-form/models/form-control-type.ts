import { Type } from '@angular/core';
import { Field } from './field.interface';
export class FormControlType {
    type: string;
    value: Type<Field>
}