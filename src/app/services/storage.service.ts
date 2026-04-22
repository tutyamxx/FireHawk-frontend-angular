import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class StorageService {
    save = (key: string, value: any): void => localStorage.setItem(key, JSON.stringify(value));
    load = (key: string): any => JSON.parse(localStorage.getItem(key) || '{}');
}
