import { CommonModule } from '@angular/common';
import { SplitContainer } from '@framework-components/splitcontainer/SplitContainer';
import { NgModule } from '@angular/core';
import { SplitContainerItem } from '@framework-components/splitcontainer/SplitContainerItem';

@NgModule({
    imports: [CommonModule],
    exports: [
        SplitContainer,
        SplitContainerItem
    ],
    declarations: [
        SplitContainer,
        SplitContainerItem
    ]
})
export class SplitContainerModule { }