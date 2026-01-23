import { Component, inject, OnInit, signal } from '@angular/core';
import { JobCardComponent } from "../../components/job-card/job-card.component";
import { JobPosting } from '../../../electron/interface';
import { JobsService } from '../../services/jobs.service';
import { openUrl, openUrlBrowser } from '../../services/utility';

@Component({
  selector: 'app-saved',
  imports: [JobCardComponent],
  templateUrl: './saved.component.html',
  styles: ``
})
export class SavedComponent implements OnInit {

  private jobsService = inject(JobsService)

  savedJobs = signal<JobPosting[]>([]);

  async ngOnInit() {
    this.savedJobs.set(await this.jobsService.fetchSavedJobs())
  }

  toggleSaveJob = async (job: JobPosting) => {
    await this.jobsService.toggleSaveJob(job)
    this.savedJobs.set(await this.jobsService.fetchSavedJobs())
  }

  applyJob = async (job: JobPosting) => {
    await this.jobsService.applyJob(job)
    this.savedJobs.set(await this.jobsService.fetchSavedJobs())
  }
  
  openInBrowser = (url: string) => {
    openUrlBrowser(url)
  }
}
