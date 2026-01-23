import { inject, Injectable, signal } from '@angular/core';
import { AutoFetchSettings, Company, CompanyPreference, JobPosting, Preferences, ScraperOptions } from '../../electron/interface';
import { Router } from '@angular/router';
import { openUrl } from './utility';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  companies = signal<Company[]>([])
  countries = signal<{ name: string, value: string }[]>([])
  searchOptions = {
    query: '',
    country: '',
    companyId: ''
  }
  hideApplied = signal<boolean>(false)
  
  jobs = signal<JobPosting[]>([]);
  multiSearchJobs = signal<JobPosting[]>([]);
  newJobs = signal<JobPosting[]>([]);


  savedJobs = signal<JobPosting[]>([]);

  private autoFetchTimer: any;
  private router = inject(Router);

  fetchJobs = async (companyId: string, options: ScraperOptions) => {
    const data = await window.api.fetchJobs(companyId, options);
    this.jobs.set(data);
  }

  bulkFetchJobs = async (query: string, preferences: CompanyPreference[]) => {
    const allJobs: JobPosting[] = [];

    for (const pref of preferences) {
      const options: ScraperOptions = { query };
      if (pref.defaultCountry) {
        options.country = pref.defaultCountry;
      }
      try {
        const data = await window.api.fetchJobs(pref.companyId, options);
        allJobs.push(...data);
      } catch (e) {
        console.error(`Failed to fetch jobs for ${pref.companyId}`, e);
      }
    }

    return allJobs
  }

  fetchCompanies = async () => {
    this.companies.set(await window.api.getCompanies())
  }

  fetchCountries = async (id: string) => {
    this.countries.set(await window.api.getCountries(id))
  }

  fetchSavedJobs = async () => {
    return await window.api.getSavedJobs()
  }

  fetchAppliedJobs = async () => {
    return await window.api.getAppliedJobs()
  }

  fetchPreferences = async () => {
    const prefs = await window.api.getPreferences();
    return prefs || { searchQuery: '', companyPreferences: [], autoFetchSettings: { enabled: false, interval: 60 } };
  }

  savePreferences = async (prefs: Preferences) => {
    window.api.savePreferences(prefs);
  }

  toggleSaveJob = async (job: JobPosting) => {
    window.api.toggleSaveJob(job)
    this.jobs.update(jobs => jobs.map(j =>
      j.url === job.url ? { ...j, saved: !job.saved } : j
    ))
    this.multiSearchJobs.update(jobs => jobs.map(j =>
      j.url === job.url ? { ...j, saved: !job.saved } : j
    ))
  }

  applyJob = async (job: JobPosting) => {
    openUrl(job.url)
    window.api.applyJob(job)
    this.jobs.update(jobs => jobs.map(j =>
      j.url === job.url ? { ...j, applied: true } : j
    ))
    this.multiSearchJobs.update(jobs => jobs.map(j =>
      j.url === job.url ? { ...j, saved: !job.saved } : j
    ))
  }

  startAutoFetch = () => {
    this.stopAutoFetch();
    // const settings = this.preferences().autoFetchSettings;
    // if (!settings?.enabled) return;

    // const intervalMs = settings.interval * 60 * 1000;
    // this.autoFetchTimer = setInterval(() => this.performAutoFetch(), intervalMs);
    // console.log(`Auto-fetch started with interval: ${settings.interval} min`);
  }

  stopAutoFetch = () => {
    if (this.autoFetchTimer) {
      clearInterval(this.autoFetchTimer);
      this.autoFetchTimer = null;
      console.log('Auto-fetch stopped');
    }
  }

  private performAutoFetch = async () => {
    // console.log('Performing auto-fetch...');
    // const prefs = this.preferences();
    // if (!prefs.companyPreferences) return;

    // const enabledPrefs = prefs.companyPreferences.filter(p => p.enabled);
    // if (enabledPrefs.length === 0) return;

    // const query = prefs.searchQuery || 'Software Engineer';
    // const allJobs = await this.bulkFetchJobs(query, enabledPrefs);
    // await this.processNewJobs(allJobs);
  }

  private processNewJobs = async (fetchedJobs: JobPosting[]) => {
    const existingUrls = new Set([...this.jobs()].map(j => j.url));
    const newlyFound = fetchedJobs.filter(j => !existingUrls.has(j.url));

    if (newlyFound.length > 0) {
      const currentNew = await window.api.getNewPostings();
      const updatedNew = [...newlyFound, ...currentNew];
      await window.api.saveNewPostings(updatedNew);
      this.newJobs.set(updatedNew);

      this.notifyUser(newlyFound.length);
    }
  }

  private notifyUser(count: number) {
    const notification = new Notification('New Job Postings Found', {
      body: `Found ${count} new job postings since last check. Click to view.`,
    });

    notification.onclick = () => {
      window.focus();
      this.router.navigate(['/auto-fetch']);
    };
  }

  loadNewPostings = async () => {
    const postings = await window.api.getNewPostings();
    this.newJobs.set(postings || []);
  }

  clearNewPostings = async () => {
    window.api.saveNewPostings([]);
    this.newJobs.set([]);
  }

}
