import { Injectable, signal } from '@angular/core';
import { Company, CompanyPreference, JobPosting, ScraperOptions } from '../../electron/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  searchForm = new FormGroup({
    query: new FormControl(''),
    country: new FormControl(''),
    companyId: new FormControl('', Validators.required)
  })

  countries = signal<{ name: string, value: string }[]>([])
  jobs = signal<JobPosting[]>([]);
  preferences = signal<CompanyPreference[]>([]);

  fetchJobs = async (companyId: string, options: ScraperOptions) => {
    const data = await window.api.fetchJobs(companyId, options);
    this.jobs.set(data);
  }

  bulkFetchJobs = async (query: string) => {
    const prefs = this.preferences().filter(p => p.enabled);
    const allJobs: JobPosting[] = [];

    for (const pref of prefs) {
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

    this.jobs.set(allJobs);
  }

  getCompanies = async () => {
    return await window.api.getCompanies()
  }

  getCountries = async (id: string) => {
    return await window.api.getCountries(id)
  }

  loadPreferences = async () => {
    const prefs = await window.api.getPreferences();
    this.preferences.set(prefs || []);
  }

  savePreferences = async (prefs: CompanyPreference[]) => {
    await window.api.savePreferences(prefs);
    this.preferences.set(prefs);
  }

}
