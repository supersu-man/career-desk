import { Injectable, signal } from '@angular/core';
import { JobPosting, ScraperOptions } from '../../electron/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  searchForm = new FormGroup({
    query: new FormControl(''),
    companyId: new FormControl('', Validators.required)
  })

  jobs = signal<JobPosting[]>([]);

  private api = (window as any).api;

  fetchJobs = async (companyId: string, query: string) => {
    const options: ScraperOptions = {};
    if (query) options.query = query;

    const data = await this.api.fetchJobs(companyId, options);

    this.jobs.set(data);
  }

  getCompanies = async () => {
    const companies = await this.api.getCompanies()
    return companies
  }

}
