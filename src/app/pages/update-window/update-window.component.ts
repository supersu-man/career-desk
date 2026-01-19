import { Component, signal } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-update-window',
    imports: [MatProgressBarModule, DecimalPipe],
    templateUrl: './update-window.component.html',
    styles: ``
})
export class UpdateWindowComponent {
    progress = signal(0);

    constructor() {
        window.api.onUpdateProgress((percent) => {
            console.log(percent)
            this.progress.set(percent);
        });
    }
}
