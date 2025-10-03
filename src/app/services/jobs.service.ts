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

  jobs = signal<JobPosting[]>([]);

  private api = (window as any).api;

  fetchJobs = async (companyId: string, options: ScraperOptions) => {
    const data = await this.api.fetchJobs(companyId, options);

    this.jobs.set(data);
  }

  getCompanies = async () => {
    return await this.api.getCompanies()
  }

  getCountries = async (id: string) => {
    return await this.api.getCountries(id)
  }

}
