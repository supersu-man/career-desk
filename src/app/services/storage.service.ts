import { inject, Injectable, signal } from '@angular/core';
import { JobPosting } from '../../electron/interface';
import { JobsService } from './jobs.service';
import { openUrl } from './utility';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = (window as any).storage;

  savedJobs = signal<JobPosting[]>([]);
  appliedJobs = signal<JobPosting[]>([]);

  jobsService = inject(JobsService)

  fetchSavedJobs = async () => {
    const savedJobs = await this.storage.getSavedJobs();
    this.savedJobs.set(savedJobs)
  }

  fetchAppliedJobs = async () => {
    const appliedJobs = await this.storage.getAppliedJobs();
    this.appliedJobs.set(appliedJobs)
  }

  toggleSaveJob = async (job: JobPosting) => {
    await this.storage.toggleJob(job, "save")
    this.jobsService.jobs.set(this.jobsService.jobs().map(j =>
      j.url === job.url ? { ...j, saved: !job.saved } : j
    ))
  }

  applyJob = async (job: JobPosting) => {
    if (job.applied) return
    await this.storage.toggleJob(job, "apply")
    this.jobsService.jobs.set(this.jobsService.jobs().map(j =>
      j.url === job.url ? { ...j, applied: !job.applied } : j
    ))
  }

}
