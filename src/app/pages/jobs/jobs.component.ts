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
import { openUrl, openUrlBrowser } from '../../services/utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JobCardComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatCheckboxModule],
  templateUrl: './jobs.component.html',
  styles: ``
})
export class JobsComponent {

  companies = signal<Company[]>([]);
  loader = signal<boolean>(false)
  hideApplied = signal<boolean>(false);

  filteredJobs = computed(() => {
    const jobs = this.jobsService.jobs();
    if (this.hideApplied()) {
      return jobs.filter(j => !j.applied);
    }
    return jobs;
  });

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
    this.jobsService.countries.set(await this.jobsService.getCountries(id!))
  }

  toggleSave = async (job: JobPosting) => {
    await this.storageService.toggleSaveJob(job);
  }

  applyJob = async (job: JobPosting) => {
    openUrl(job.url)
    await this.storageService.applyJob(job)
  }

  openInBrowser = (url: string) => {
    openUrlBrowser(url)
  }

}
