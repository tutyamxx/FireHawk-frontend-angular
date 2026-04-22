import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CarService } from '../../services/car.service';
import { StorageService } from '../../services/storage.service';
import { CsvService } from '../../services/csv.service';
import { Car } from '../../models/car.model';
import { FiltersComponent } from '../filters/filters.component';

@Component({
    selector: 'app-car-table',
    standalone: true,
    imports: [CommonModule, FormsModule, FiltersComponent],
    templateUrl: './car-table.component.html',
})
export class CarTableComponent implements OnInit {
    cars: Car[] = [];
    filteredCars: Car[] = [];

    filters: any = {};
    searchTerm = '';

    loading = true;

    constructor(
        private carService: CarService,
        private storage: StorageService,
        private csv: CsvService,
    ) {}

    ngOnInit(): void {
        this.filters = this.storage.load('filters') || {};

        console.log('CarTable init started');
        console.log('Loaded filters:', this.filters);

        this.carService.getCars().subscribe({
            next: (data) => {
                console.log('Cars loaded from Firestore:', data);

                this.cars = data || [];
                this.loading = false;
                this.applyFilters();
            },

            error: (err) => {
                console.error('Firestore error:', err);

                this.loading = false;
                this.cars = [];
                this.filteredCars = [];
            },
        });
    }

    applyFilters = (): void => {
        console.log('Applying filters:', this.filters);
        console.log('Total cars before filter:', this.cars.length);

        this.filteredCars = (this.cars || [])
            .filter(
                (car) =>
                    (car?.make ?? '')
                        .toLowerCase()
                        .includes(this.filters?.make?.toLowerCase() || '') &&
                    (car?.origin ?? '')
                        .toLowerCase()
                        .includes(this.filters?.origin?.toLowerCase() || '') &&
                    (this.filters?.cylinders
                        ? car?.cylinders === Number(this.filters.cylinders)
                        : true) &&
                    (this.filters?.efficiency ? car?.efficiency === this.filters.efficiency : true),
            )
            .filter((car) =>
                Object.values(car || {}).some((v) =>
                    (v ?? '').toString().toLowerCase().includes(this.searchTerm.toLowerCase()),
                ),
            );

        console.log('Filtered cars:', this.filteredCars.length);
    };

    onFiltersChanged = (filters: any): void => {
        console.log('Filters changed:', filters);

        this.filters = filters || {};
        this.storage.save('filters', this.filters);

        this.applyFilters();
    };

    exportCSV = (): void => {
        console.log('Exporting CSV:', this.filteredCars.length);
        this.csv.export(this.filteredCars);
    };
}
