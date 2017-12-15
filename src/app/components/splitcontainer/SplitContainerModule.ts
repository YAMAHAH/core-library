import { CommonModule } from '@angular/common';
import { HorizontalSplitContainer } from '@framework-components/splitcontainer/SplitContainer';
import { NgModule } from '@angular/core';
import { SplitContainerItem } from '@framework-components/splitcontainer/SplitContainerItem';

@NgModule({
    imports: [CommonModule],
    exports: [
        HorizontalSplitContainer,
        SplitContainerItem
    ],
    declarations: [
        HorizontalSplitContainer,
        SplitContainerItem
    ]
})
export class SplitContainerModule { }