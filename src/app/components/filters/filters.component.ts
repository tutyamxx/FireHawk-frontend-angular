import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './filters.component.html',
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
