import { _MatSortMixinBase, CanDisable, MatSortable, SortDirection, Sort, MatSort } from '@angular/material';
import { Directive, OnChanges, OnDestroy, Input, isDevMode, EventEmitter, Output } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError } from './sort-errors';

@Directive({
    selector: '[adkSort]',
    exportAs: 'adkSort',
    inputs: ['disabled: adkSortDisabled']
})
export class AdkSort extends _MatSortMixinBase implements CanDisable, OnChanges, OnDestroy {

    /** Collection of all registered sortables that this directive manages. */
    sortables = new Map<string, MatSortable>();

    /** Used to notify any child components listening to state changes. */
    _stateChanges = new Subject<void>();
    _active: string;

    /** The id of the most recently sorted MatSortable. */
    @Input('adkSortActive') get active(): string {
        return this._active;
    }
    set active(value) {
        if (this._active != value) {
            this._active = value;
            this.getActiveSortFields();
            this.sortChange.next(this.activeSorts);
        }
    }

    activeSorts: Sort[] = [];

    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the MatSortable's sort start.
     */
    @Input('adkSortStart') start: 'asc' | 'desc' = 'asc';

    /** The sort direction of the currently active MatSortable. */
    // @Input('adkSortDirection')
    // set direction(direction: SortDirection) {
    //     if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
    //         throw getSortInvalidDirectionError(direction);
    //     }
    //     this._direction = direction;
    // }
    // get direction(): SortDirection { return this._direction; }
    // private _direction: SortDirection = '';

    getSortDirection(active) {
        return this.activeSorts.find(sort => sort.active == active).direction;
    }
    getSortOrder(active) {
        return this.activeSorts.findIndex(sort => sort.active == active) + 1;
    }
    get isMutliFieldSort() {
        return this.activeSorts.length > 1;
    }

    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     */
    @Input('adkSortDisableClear')
    get disableClear() { return this._disableClear; }
    set disableClear(v: boolean) { this._disableClear = coerceBooleanProperty(v); }
    private _disableClear: boolean;

    /** Event emitted when the user changes either the active sort or sort direction. */
    @Output('adkSortChange') readonly sortChange: EventEmitter<any> = new EventEmitter<Sort[]>();

    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable: MatSortable) {
        if (!sortable.id) {
            throw getSortHeaderMissingIdError();
        }

        if (this.sortables.has(sortable.id)) {
            throw getSortDuplicateSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    }

    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable: MatSortable) {
        this.sortables.delete(sortable.id);
    }

    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MatSortable, metaKey: boolean = false) {
        if (!this.active || !this.activeSorts) {
            this.activeSorts = [];
        } else {
            this.getActiveSortFields(sortable);
        }
        let foundedSortable = this.activeSorts.find(actSort => actSort.active == sortable.id);
        if (!metaKey && !foundedSortable) this.activeSorts = [];
        if (!metaKey && foundedSortable) this.activeSorts = [foundedSortable];
        if (!foundedSortable) {
            let direction = sortable.start ? sortable.start : this.start;
            this.activeSorts.push({ active: sortable.id, direction: direction });
        } else {
            foundedSortable.direction = this.getNextSortDirection(sortable);
            if (foundedSortable.direction == '')
                this.activeSorts.remove(foundedSortable);
        }
        this.active = this.joinSortFiled(this.activeSorts);
        this.sortChange.next(this.activeSorts);
    }
    joinSortFiled(sortFields: Sort[] = []) {
        let activeSort = null;
        sortFields.forEach(sort => {
            if (!activeSort)
                activeSort = sort.active + " " + sort.direction
            else
                activeSort += "," + sort.active + " " + sort.direction;
        });
        return activeSort;
    }
    getActiveSortFields(sortable: MatSortable = null) {
        let activeSorts: Sort[] = [];
        if (!this.active) return activeSorts;
        let sortFields = this.active.split(',');
        sortFields.forEach(field => {
            let sortInfos = field.split(' ');
            if (sortInfos.length == 1)
                activeSorts.push({
                    active: sortInfos[0],
                    direction: sortable && sortable.start || this.start
                });

            if (sortInfos.length == 2)
                activeSorts.push({
                    active: sortInfos[0],
                    direction: sortInfos[1].toLowerCase() == 'asc' ? 'asc' : 'desc'
                });
        });
        return this.activeSorts = activeSorts;
    }

    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MatSortable): SortDirection {
        if (!sortable) { return ''; }

        // Get the sort direction cycle with the potential sortable overrides.
        const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);

        // Get and return the next direction in the cycle
        let sortDirection = this.activeSorts.find(s => s.active == sortable.id).direction;
        let nextDirectionIndex = sortDirectionCycle.indexOf(sortDirection) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) { nextDirectionIndex = 0; }
        return sortDirectionCycle[nextDirectionIndex];
    }

    ngOnChanges() {
        this._stateChanges.next();
    }

    ngOnDestroy() {
        this._stateChanges.complete();
    }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start: 'asc' | 'desc',
    disableClear: boolean): SortDirection[] {
    let sortOrder: SortDirection[] = ['asc', 'desc'];
    if (start == 'desc') { sortOrder.reverse(); }
    if (!disableClear) { sortOrder.push(''); }

    return sortOrder;
}