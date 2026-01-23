import { Component, inject, signal } from '@angular/core';
import { JobsService } from '../../services/jobs.service';
import { openUrl, openUrlBrowser } from '../../services/utility';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobPosting } from '../../../electron/interface';

@Component({
  selector: 'app-applied',
  imports: [JobCardComponent],
  templateUrl: './applied.component.html',
  styles: ``
})
export class AppliedComponent {
  
  private jobService = inject(JobsService)

  appliedJobs = signal<JobPosting[]>([]);

  async ngOnInit() {
    this.appliedJobs.set(await this.jobService.fetchAppliedJobs())
  }

  applyJob = async (job: JobPosting) => {
    await this.jobService.applyJob(job)
    this.appliedJobs.set(await this.jobService.fetchAppliedJobs())
  }

  toggleSaveJob = async (job: JobPosting) => {
    await this.jobService.toggleSaveJob(job)
    this.appliedJobs.set(await this.jobService.fetchAppliedJobs())
  }

  openInBrowser = (url: string) => {
    openUrlBrowser(url)
  }
}
