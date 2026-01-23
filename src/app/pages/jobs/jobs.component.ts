import { Component, inject, signal } from '@angular/core';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Company, JobPosting, ScraperOptions } from '../../../electron/interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobsService } from '../../services/jobs.service';
import { openUrl, openUrlBrowser } from '../../services/utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [FormsModule, JobCardComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatCheckboxModule],
  templateUrl: './jobs.component.html',
  styles: ``
})
export class JobsComponent {

  jobsService = inject(JobsService)

  loader = signal<boolean>(false)

  filteredJobs = computed(() => {
    const jobs = this.jobsService.jobs();
    if (this.jobsService.hideApplied()) {
      return jobs.filter((j: any) => !j.applied);
    }
    return jobs;
  });

  fetch = async () => {
    this.loader.set(true)
    const { companyId, ...rawOptions } = this.jobsService.searchOptions
    if (!companyId) return
    await this.jobsService.fetchJobs(companyId, rawOptions as ScraperOptions)
    this.loader.set(false)
  }

  getCountries = async () => {
    const { companyId } = this.jobsService.searchOptions
    if (!companyId) return
    await this.jobsService.fetchCountries(companyId)
  }

  openInBrowser = (url: string) => {
    openUrlBrowser(url)
  }

}
