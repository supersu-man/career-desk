import { Injectable, signal } from '@angular/core';
import { JobPosting, ScraperOptions } from '../../electron/interface';
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

  fetchJobs = async (companyId: string, options: ScraperOptions) => {
    const data = await window.api.fetchJobs(companyId, options);

    this.jobs.set(data);
  }

  getCompanies = async () => {
    return await window.api.getCompanies()
  }

  getCountries = async (id: string) => {
    return await window.api.getCountries(id)
  }

}
