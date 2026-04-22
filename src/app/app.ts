import { Component, signal } from '@angular/core';
import { CarTableComponent } from './components/car-table/car-table.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CarTableComponent],
    template: `
        <div class="app-container">
            <h1>Cars Database</h1>
            <app-car-table />
        </div>
    `,
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('frontend');
}
