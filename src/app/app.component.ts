import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronAPI } from '../electron/interface';
import { JobsService } from './services/jobs.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  jobsService = inject(JobsService);

  ngOnInit() {
    this.jobsService.fetchCompanies();
    // this.jobsService.fetchPreferences();
    // if (this.jobsService.preferences()?.autoFetchSettings?.enabled) {
    //   this.jobsService.startAutoFetch();
    // }
  }
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}