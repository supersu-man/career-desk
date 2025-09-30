import { Injectable, signal } from '@angular/core';
import { JobPosting, ScraperOptions } from '../../electron/interface';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  jobs = signal<JobPosting[]>([]);

  private api = (window as any).api;

  fetchJobs = async (companyId: string, query: string) => {
    const options: ScraperOptions = {};
    if (query) options.query = query;

    const data = await this.api.fetchJobs(companyId, options);

    this.jobs.set(data);
  }

  apply = (url: string) => {
    this.api.openUrl(url)
  }

  getCompanies = async () => {
    const companies = await this.api.getCompanies()
    return companies
  }

}
