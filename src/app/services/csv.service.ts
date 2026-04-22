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

        const headers = Object.keys(cars[0]) as (keyof Car)[];

        const csv = [
            headers.join(','),
            ...cars.map((car: Car) =>
                headers
                    .map((h: keyof Car) => {
                        const value = car[h];

                        return `"${value ?? ''}"`;
                    })
                    .join(','),
            ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'cars.csv';
        a.click();

        URL.revokeObjectURL(url);
    };
}
