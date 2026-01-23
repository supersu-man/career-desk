import { Component, computed, inject, signal } from '@angular/core';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobsService } from '../../services/jobs.service';
import { openUrlBrowser } from '../../services/utility';
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
    router = inject(Router);

    hideApplied = signal<boolean>(false);

    filteredJobs = computed(() => {
        const jobs = this.jobsService.multiSearchJobs();
        if (this.hideApplied()) {
            return jobs.filter(j => !j.applied);
        }
        return jobs;
    });

    openInBrowser = (url: string) => {
        openUrlBrowser(url)
    }

    backToSearch() {
        this.router.navigate(['/multi-search']);
    }
}
