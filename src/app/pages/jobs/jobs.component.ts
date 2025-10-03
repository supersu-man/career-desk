import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Company, JobPosting, ScraperOptions } from '../../../electron/interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobsService } from '../../services/jobs.service';
import { StorageService } from '../../services/storage.service';
import { openUrl } from '../../services/utility';

@Component({
  selector: 'app-jobs',
  imports: [ReactiveFormsModule, JobCardComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './jobs.component.html',
  styles: ``
})
export class JobsComponent {

  companies = signal<Company[]>([]);
  countries = signal<{ name: string, value: string }[]>([])
  loader = signal<boolean>(false)

  constructor(public jobsService: JobsService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.jobsService.getCompanies().then(companies => {
      this.companies.set(companies);
    })
  }

  fetch = async () => {
    this.loader.set(true)
    if (!this.jobsService.searchForm.valid) return
    const form = this.jobsService.searchForm.getRawValue()
    const { companyId, ...rawOptions } = form
    const options: ScraperOptions = Object.fromEntries(
      Object.entries(rawOptions).filter(([_, v]) => v != null && v !== '')
    );
    await this.jobsService.fetchJobs(companyId!, options)
    this.loader.set(false)
  }

  getCountries = async () => {
    const form = this.jobsService.searchForm
    form.patchValue({ country: null })
    const id = form.getRawValue().companyId
    if (!form.valid) return
    console.log(await this.jobsService.getCountries(id!))
    this.countries.set(await this.jobsService.getCountries(id!))
  }

  toggleSave = async (job: JobPosting) => {
    await this.storageService.toggleSaveJob(job);
  }

  apply = (url: string) => {
    openUrl(url)
  }

}
