import { TemplateRef } from "@angular/core";
import { FlexLayoutDirective } from "@framework-common/directives/flex-layout.directive";
import { FlexItemDirective } from "@framework-common/directives/flex-item.directive";

export type FormFieldTemplateRefType = { tempRef: TemplateRef<any>, context: any };

export type FormFieldFlexLayoutType = { flexItem: FlexItemDirective, flexContainer: FlexLayoutDirective };