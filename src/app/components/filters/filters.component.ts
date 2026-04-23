import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Car } from '../../models/car.model';

/**
 * Filter UI for Car dataset.
 * Uses Partial<Car> so only filter-relevant fields are used.
 */
@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.css'
})
export class FiltersComponent {
    @Input() filters: Partial<Car> = {
        make: '',
        origin: '',
        cylinders: '',
        efficiency: ''
    };

    /**
     * Emits updated filter state to parent
     */
    @Output() filtersChanged = new EventEmitter<Partial<Car>>();

    /**
     * Emits current filter state whenever user changes input
     */
    update = (): void => {
        this.filtersChanged.emit(this.filters);
    };
}
