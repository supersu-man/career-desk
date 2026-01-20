import { inject, Injectable, signal } from '@angular/core';
import { CompanyPreference, JobPosting } from '../../electron/interface';
import { JobsService } from './jobs.service';
import { openUrl } from './utility';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  savedJobs = signal<JobPosting[]>([]);
  appliedJobs = signal<JobPosting[]>([]);

  jobsService = inject(JobsService)

  fetchSavedJobs = async () => {
    const savedJobs = await window.api.getSavedJobs();
    this.savedJobs.set(savedJobs)
  }

  fetchAppliedJobs = async () => {
    const appliedJobs = await window.api.getAppliedJobs();
    this.appliedJobs.set(appliedJobs)
  }

  toggleSaveJob = async (job: JobPosting) => {
    await window.api.toggleJob(job, "save")
    this.jobsService.jobs.set(this.jobsService.jobs().map(j =>
      j.url === job.url ? { ...j, saved: !job.saved } : j
    ))
  }

  applyJob = async (job: JobPosting) => {
    if (job.applied) return
    await window.api.toggleJob(job, "apply")
    this.jobsService.jobs.set(this.jobsService.jobs().map(j =>
      j.url === job.url ? { ...j, applied: !job.applied } : j
    ))
  }

  loadPreferences = async () => {
    const prefs = await window.api.getPreferences();
    return prefs || [];
  }

  savePreferences = async (prefs: CompanyPreference[]) => {
    window.api.savePreferences(prefs);
  }

}
