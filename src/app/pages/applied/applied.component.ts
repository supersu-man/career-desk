import { Component } from '@angular/core';
import { JobsService } from '../../services/jobs.service';
import { StorageService } from '../../services/storage.service';
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
  constructor(public storageService: StorageService) { }

  ngOnInit(): void {
    this.storageService.fetchAppliedJobs()
  }

  toggleSave = async (job: JobPosting) => {
    await this.storageService.toggleSaveJob(job)
    await this.storageService.fetchAppliedJobs()
  }

  applyJob = async (job: JobPosting) => {
    openUrl(job.url)
    await this.storageService.applyJob(job)
    await this.storageService.fetchAppliedJobs()
  }

  openInBrowser = (url: string) => {
    openUrlBrowser(url)
  }
}
