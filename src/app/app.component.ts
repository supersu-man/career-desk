import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronAPI } from '../electron/interface';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent { }

declare global {
  interface Window {
    api: ElectronAPI;
  }
}