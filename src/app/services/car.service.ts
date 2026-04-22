import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
    providedIn: 'root',
})
export class CarService {
    constructor(private firestore: Firestore) {}

    getCars = (): Observable<Car[]> => {
        const ref = collection(this.firestore, 'cars');

        return collectionData(ref, { idField: 'id' }).pipe(
            map((cars) => cars.map((car) => this.transform(car as Car))),
        );
    };

    transform = (car: Car): Car => {
        const parts = car?.name?.split(' ') || [];
        const mpg = Number(car?.mpg);

        return {
            ...car,
            make: parts[0],
            model: parts.slice(1).join(' '),
            efficiency: this.getEfficiency(mpg),
        };
    };

    getEfficiency = (mpg: number): 'High' | 'Medium' | 'Low' => {
        if (mpg > 30) return 'High';
        if (mpg > 20) return 'Medium';
        return 'Low';
    };
}
