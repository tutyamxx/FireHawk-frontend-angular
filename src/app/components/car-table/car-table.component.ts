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
        MatProgressSpinnerModule
    ],
    templateUrl: './car-table.component.html',
    styleUrl: './car-table.component.css'
})

/**
 * Car table component responsible for:
 * - Fetching cars from Firestore
 * - Filtering and searching dataset
 * - Pagination
 * - CSV export
 * - Persisting filters in storage
 */
export class CarTableComponent implements OnInit {
    cars: Car[] = [];
    filteredCars: Car[] = [];
    pagedCars: Car[] = [];

    /**
     * Table column definitions for Angular Material table
     */
    displayedColumns: string[] = ['make', 'model', 'mpg', 'cylinders', 'horsepower', 'year', 'origin', 'efficiency'];

    filters: any = {};
    searchTerm = '';

    loading = true;

    pageSize = 20;
    pageIndex = 0;

    constructor(
        private carService: CarService,
        private storage: StorageService,
        private csv: CsvService
    ) {}

    /**
     * Lifecycle hook:
     * - Loads saved filters + search term from storage
     * - Fetches car data from Firestore
     * - Initializes filtered view
     */
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
            }
        });
    }

    /**
     * Applies:
     * - field filters (make, origin, cylinders, efficiency)
     * - global search across all fields
     * Resets pagination to page 1.
     */
    applyFilters = (): void => {
        const search = this.searchTerm.toLowerCase();
        const { make, origin, cylinders, efficiency } = this.filters || {};

        this.filteredCars = (this.cars ?? []).filter(car => {
            const matchesMake = !make || car?.make?.toLowerCase().includes(make.toLowerCase());
            const matchesOrigin = !origin || car?.origin?.toLowerCase().includes(origin.toLowerCase());
            const matchesCyl = !cylinders || car?.cylinders === Number(cylinders);
            const matchesEff = !efficiency || car?.efficiency === efficiency;

            const matchesSearch =
                !search ||
                Object.values(car ?? {}).some(v =>
                    String(v ?? '')
                        .toLowerCase()
                        .includes(search)
                );

            return matchesMake && matchesOrigin && matchesCyl && matchesEff && matchesSearch;
        });

        this.pageIndex = 0;
        this.updatePagedCars();
    };

    /**
     * Updates paginated slice of filtered cars
     */
    updatePagedCars(): void {
        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;

        this.pagedCars = this.filteredCars.slice(start, end);
    }

    /**
     * Handles Angular Material paginator changes
     */
    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.updatePagedCars();
    }

    /**
     * Resets all filters and search state,
     * clears storage, and refreshes table
     */
    resetFilters(): void {
        this.filters = {
            make: '',
            origin: '',
            cylinders: '',
            efficiency: ''
        };

        this.searchTerm = '';

        this.storage.save('filters', this.filters);
        this.storage.save('searchTerm', '');

        this.applyFilters();
    }

    /**
     * Triggered when filter component emits new values
     */
    onFiltersChanged = (filters: any): void => {
        this.filters = filters || {};
        this.storage.save('filters', this.filters);

        this.applyFilters();
    };

    /**
     * Triggered on search input change
     */
    onSearchChanged = (): void => {
        this.storage.save('searchTerm', this.searchTerm);
        this.applyFilters();
    };

    /**
     * Exports currently filtered dataset as CSV
     */
    exportCSV = (): void => {
        this.csv.export(this.filteredCars);
    };
}
