import { Component, inject, OnInit, signal } from '@angular/core';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../../services/jobs.service';
import { openUrl, openUrlBrowser } from '../../services/utility';
import { JobPosting, Preferences } from '../../../electron/interface';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-auto-fetch',
    standalone: true,
    imports: [JobCardComponent, MatButtonModule, MatSlideToggleModule, MatSelectModule, FormsModule],
    templateUrl: './auto-fetch.component.html',
    styles: ``
})
export class AutoFetchComponent {
    jobsService = inject(JobsService);

    autoFetchIntervals = [
        { label: '30 min', value: 30 },
        { label: '1 hr', value: 60 },
        { label: '6 hrs', value: 360 }
    ];
    autoFetchEnabled = signal(false);
    autoFetchInterval = signal(30);
    ngOnInit() {
        this.jobsService.fetchPreferences().then(prefs => {
            this.autoFetchInterval.set(prefs.autoFetchSettings.interval);
            this.autoFetchEnabled.set(prefs.autoFetchSettings.enabled);
        });
    }


    async onAutoFetchToggle(enabled: boolean) {
        const current = await this.jobsService.fetchPreferences();
        await this.jobsService.savePreferences({
            ...current,
            autoFetchSettings: { ...current.autoFetchSettings, enabled }
        });
        if (enabled) {
            this.jobsService.startAutoFetch();
        } else {
            this.jobsService.stopAutoFetch();
        }
    }

    async onIntervalChange(interval: 30 | 60 | 360) {
        const current = await this.jobsService.fetchPreferences();
        await this.jobsService.savePreferences({
            ...current,
            autoFetchSettings: { ...current.autoFetchSettings, interval }
        });
    }


    openInBrowser = (url: string) => {
        openUrlBrowser(url)
    }

    async clearAll() {
        await this.jobsService.clearNewPostings();
    }
}
