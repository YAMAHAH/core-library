import { CommonModule } from '@angular/common';
import { HorizontalSplitContainer } from '@framework-components/splitcontainer/HorizontalSplitContainer';
import { VerticalSplitContainer } from '@framework-components/splitcontainer/VerticalSplitContainer';
import { NgModule } from '@angular/core';
import { SplitContainerItem } from '@framework-components/splitcontainer/SplitContainerItem';

@NgModule({
    imports: [CommonModule],
    exports: [
        HorizontalSplitContainer,
        VerticalSplitContainer,
        SplitContainerItem
    ],
    declarations: [
        HorizontalSplitContainer,
        VerticalSplitContainer,
        SplitContainerItem
    ]
})
export class SplitContainerModule { }