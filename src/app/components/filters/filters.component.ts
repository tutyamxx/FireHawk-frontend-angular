import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './filters.component.html',
})
export class FiltersComponent {
    @Output() filtersChanged = new EventEmitter<any>();

    filters = {
        make: '',
        origin: '',
        cylinders: '',
        efficiency: '',
    };

    update = (): void => {
        this.filtersChanged.emit(this.filters);
    };
}
