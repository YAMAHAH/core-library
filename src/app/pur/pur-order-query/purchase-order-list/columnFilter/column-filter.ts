import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
@Component({
  moduleId: module.id,
  selector: 'adk-column-filter',
  templateUrl: './column-filter.html',
  styleUrls: ['./column-filter.scss'],
  host: {
    '[class.el-hide]': 'false',
    '[class.el-flex-show]': 'false'
  }
})
export class ColumnFilterComponent implements AfterViewInit {
  ngAfterViewInit(): void {

    fromEvent(this.hostElRef.nativeElement, 'click')
      .subscribe((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      });
  }
  constructor(private hostElRef: ElementRef) {

  }
  clearFilter(event) {
    console.log('click: clear Filter');
  }

}