import { inject, Injectable, signal } from '@angular/core';
import { JobPosting } from '../../electron/interface';
import { JobsService } from './jobs.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = (window as any).storage;

  jobs = signal<JobPosting[]>([]);

  jobsService = inject(JobsService)

  fetchSavedJobs = async () => {
    return await this.storage.getSavedJobs();
  }

  toggleSaveJob = async (job: JobPosting) => {
    const saved = await this.storage.toggleSaveJob(job)
    this.jobs.set(await this.fetchSavedJobs())
    this.jobsService.jobs.set(this.jobsService.jobs().map(j =>
      j.url === job.url ? { ...j, saved } : j
    ))
  }

}
