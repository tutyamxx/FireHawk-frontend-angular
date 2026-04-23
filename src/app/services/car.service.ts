import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Car } from '../models/car.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private apiUrl = `${environment?.apiUrl}/cars`;

    constructor(private http: HttpClient) {}

    // --| GET all cars from backend
    getCars = (): Observable<Car[]> => {
        return this.http.get<Car[]>(this.apiUrl).pipe(map(cars => (cars ?? []).map(car => this.transform(car))));
    };

    // --| Transform logic
    transform = (car: Car): Car => {
        const mpg = Number(car?.mpg ?? 0);

        return {
            ...car,
            make: car?.make ?? '',
            model: car?.model ?? '',
            efficiency: this.getEfficiency(mpg)
        };
    };

    // --| Efficiency calculation
    getEfficiency = (mpg?: number): 'High' | 'Medium' | 'Low' => {
        const value = mpg ?? 0;

        switch (true) {
            case value > 30:
                return 'High';

            case value > 20:
                return 'Medium';

            default:
                return 'Low';
        }
    };
}
