/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { CdkColumnDef } from '@angular/cdk/table';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';

import { AnimationCurves, AnimationDurations } from '@angular/material/core';
import { CanDisable, mixinDisabled } from '@angular/material/core';
import { MatSortable } from '@angular/material';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { AdkSortHeaderIntl } from './sort-header-intl';
import { AdkSort } from './sort';


const SORT_ANIMATION_TRANSITION =
  AnimationDurations.ENTERING + ' ' + AnimationCurves.STANDARD_CURVE;

// Boilerplate for applying mixins to the sort header.
/** @docs-private */
export class MatSortHeaderBase { }
export const _MatSortHeaderMixinBase = mixinDisabled(MatSortHeaderBase);


/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  moduleId: module.id,
  selector: '[adk-sort-header]',
  exportAs: 'adkSortHeader',
  templateUrl: './sort-header.html',
  styleUrls: ['./sort-header.scss'],
  host: {
    '(click)': '_handleClick($event)',
    '[class.mat-sort-header-sorted]': '_isSorted()',
    '[class.mat-sort-header-disabled]': '_isDisabled()',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    trigger('indicator', [
      state('asc', style({ transform: 'translateY(0px)' })),
      // 10px is the height of the sort indicator, minus the width of the pointers
      state('desc', style({ transform: 'translateY(10px)' })),
      transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    trigger('leftPointer', [
      state('asc', style({ transform: 'rotate(-45deg)' })),
      state('desc', style({ transform: 'rotate(45deg)' })),
      transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    trigger('rightPointer', [
      state('asc', style({ transform: 'rotate(45deg)' })),
      state('desc', style({ transform: 'rotate(-45deg)' })),
      transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    trigger('indicatorToggle', [
      transition('void => asc', animate(SORT_ANIMATION_TRANSITION, keyframes([
        style({ transform: 'translateY(25%)', opacity: 0 }),
        style({ transform: 'none', opacity: 1 })
      ]))),
      transition('asc => void', animate(SORT_ANIMATION_TRANSITION, keyframes([
        style({ transform: 'none', opacity: 1 }),
        style({ transform: 'translateY(-25%)', opacity: 0 })
      ]))),
      transition('void => desc', animate(SORT_ANIMATION_TRANSITION, keyframes([
        style({ transform: 'translateY(-25%)', opacity: 0 }),
        style({ transform: 'none', opacity: 1 })
      ]))),
      transition('desc => void', animate(SORT_ANIMATION_TRANSITION, keyframes([
        style({ transform: 'none', opacity: 1 }),
        style({ transform: 'translateY(25%)', opacity: 0 })
      ]))),
    ])
  ]
})
export class AdkSortHeader extends _MatSortHeaderMixinBase implements MatSortable, CanDisable {
  private _rerenderSubscription: Subscription;

  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('adk-sort-header') id: string;

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: 'before' | 'after' = 'after';

  /** Overrides the sort start value of the containing MatSort for this MatSortable. */
  @Input('start') start: 'asc' | 'desc';

  /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
  @Input()
  get disableClear(): boolean { return this._disableClear; }
  set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
  private _disableClear: boolean;

  constructor(public _intl: AdkSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() public _sort: AdkSort,
    @Optional() public _cdkColumnDef: CdkColumnDef) {

    super();

    if (!_sort) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
      .subscribe(() => changeDetectorRef.markForCheck());
  }

  ngOnInit() {
    if (!this.id && this._cdkColumnDef) {
      this.id = this._cdkColumnDef.name;
    }

    this._sort.register(this);
  }

  ngOnDestroy() {
    this._sort.deregister(this);
    this._rerenderSubscription.unsubscribe();
  }

  /** Handles click events on the header. */
  _handleClick(event: MouseEvent) {
    let metaKey = event.metaKey || event.ctrlKey;
    if (!this._isDisabled()) {
      this._sort.sort(this, metaKey);
    }
  }

  /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    let sortable = this._sort.activeSorts.find(sort => sort.active == this.id);
    return sortable && (sortable.direction === 'asc' || sortable.direction === 'desc');
  }

  _isDisabled() {
    return this._sort.disabled || this.disabled;
  }
}
