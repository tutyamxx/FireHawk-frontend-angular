import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.css',
})
export class FiltersComponent {
    @Input() filters: any = {
        make: '',
        origin: '',
        cylinders: '',
        efficiency: '',
    };

    @Output() filtersChanged = new EventEmitter<any>();

    update = (): void => {
        this.filtersChanged.emit(this.filters);
    };
}
