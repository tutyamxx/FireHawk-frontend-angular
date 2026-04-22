import { Injectable } from '@angular/core';
import { Car } from '../models/car.model';

@Injectable({
    providedIn: 'root',
})

export class CsvService {
    export = (cars: Car[]): void => {
        if (!cars?.length) {
            return;
        }

        const csvContent = this.buildCsv(cars);
        this.downloadCsv(csvContent, 'cars.csv');
    };

    // --| Build CSV string
    private buildCsv = (cars: Car[]): string => {
        const headers = Object.keys(cars[0]) as (keyof Car)[];
        const rows = cars.map((car) => headers.map((header) => `"${car?.[header] ?? ''}"`).join(','));

        return [headers.join(','), ...rows].join('\n');
    };

    // --| Trigger download
    private downloadCsv = (content: string, fileName: string): void => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(url);
    };
}
