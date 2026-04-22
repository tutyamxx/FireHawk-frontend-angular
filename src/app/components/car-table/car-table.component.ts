import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CarService } from '../../services/car.service';
import { StorageService } from '../../services/storage.service';
import { CsvService } from '../../services/csv.service';
import { Car } from '../../models/car.model';
import { FiltersComponent } from '../filters/filters.component';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-car-table',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FiltersComponent,

        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './car-table.component.html',
    styleUrl: './car-table.component.css',
})
export class CarTableComponent implements OnInit {
    cars: Car[] = [];
    filteredCars: Car[] = [];
    pagedCars: Car[] = [];

    displayedColumns: string[] = ['make', 'model', 'mpg', 'cylinders', 'horsepower', 'year', 'origin', 'efficiency'];

    filters: any = {};
    searchTerm = '';

    loading = true;

    pageSize = 20;
    pageIndex = 0;

    constructor(
        private carService: CarService,
        private storage: StorageService,
        private csv: CsvService,
    ) {}

    ngOnInit(): void {
        const savedFilters = this.storage.load('filters');
        this.filters = savedFilters || {};

        const savedSearch = this.storage.load('searchTerm');
        this.searchTerm = savedSearch || '';

        this.carService.getCars().subscribe({
            next: data => {
                this.cars = data || [];
                this.loading = false;
                this.applyFilters();
            },
            error: err => {
                console.error('Firestore error:', err);
                this.loading = false;
                this.cars = [];
                this.filteredCars = [];
                this.pagedCars = [];
            },
        });
    }

    applyFilters = (): void => {
        const search = this.searchTerm.toLowerCase();

        this.filteredCars = (this.cars || [])
            .filter(
                car =>
                    (car?.make ?? '').toLowerCase().includes(this.filters?.make?.toLowerCase() || '') &&
                    (car?.origin ?? '').toLowerCase().includes(this.filters?.origin?.toLowerCase() || '') &&
                    (this.filters?.cylinders ? car?.cylinders === Number(this.filters.cylinders) : true) &&
                    (this.filters?.efficiency ? car?.efficiency === this.filters.efficiency : true),
            )
            .filter(car => Object.values(car || {}).some(v => (v ?? '').toString().toLowerCase().includes(search)));

        this.pageIndex = 0;
        this.updatePagedCars();
    };

    updatePagedCars(): void {
        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;

        this.pagedCars = this.filteredCars.slice(start, end);
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.updatePagedCars();
    }

    resetFilters(): void {
        this.filters = {
            make: '',
            origin: '',
            cylinders: '',
            efficiency: '',
        };

        this.searchTerm = '';

        this.storage.save('filters', this.filters);
        this.storage.save('searchTerm', '');

        this.applyFilters();
    }

    onFiltersChanged = (filters: any): void => {
        this.filters = filters || {};
        this.storage.save('filters', this.filters);

        this.applyFilters();
    };

    onSearchChanged = (): void => {
        this.storage.save('searchTerm', this.searchTerm);
        this.applyFilters();
    };

    exportCSV = (): void => {
        this.csv.export(this.filteredCars);
    };
}
