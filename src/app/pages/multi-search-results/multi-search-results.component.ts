import { Component, computed, inject, signal } from '@angular/core';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobsService } from '../../services/jobs.service';
import { StorageService } from '../../services/storage.service';
import { openUrl, openUrlBrowser } from '../../services/utility';
import { JobPosting } from '../../../electron/interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-multi-search-results',
    standalone: true,
    imports: [JobCardComponent, MatButtonModule, MatCheckboxModule, FormsModule],
    templateUrl: './multi-search-results.component.html',
    styles: ``
})
export class MultiSearchResultsComponent {
    jobsService = inject(JobsService);
    storageService = inject(StorageService);
    router = inject(Router);

    hideApplied = signal<boolean>(false);

    filteredJobs = computed(() => {
        const jobs = this.jobsService.jobs();
        if (this.hideApplied()) {
            return jobs.filter(j => !j.applied);
        }
        return jobs;
    });

    toggleSave = async (job: JobPosting) => {
        await this.storageService.toggleSaveJob(job);
    }

    applyJob = async (job: JobPosting) => {
        openUrl(job.url)
        await this.storageService.applyJob(job)
    }

    openInBrowser = (url: string) => {
        openUrlBrowser(url)
    }

    backToSearch() {
        this.router.navigate(['/multi-search']);
    }
}
