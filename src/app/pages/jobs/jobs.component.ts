import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../electron/interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  imports: [ReactiveFormsModule, JobCardComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './jobs.component.html',
  styles: ``
})
export class JobsComponent {

  searchForm = new FormGroup({
    query: new FormControl(''),
    companyId: new FormControl('', Validators.required)
  })
  companies = signal<Company[]>([]);

  constructor(public jobsService: JobsService) { }

  ngOnInit(): void {
    this.jobsService.getCompanies().then(companies => {
      this.companies.set(companies);
    })
  }

  fetch = () => {
    if (!this.searchForm.valid) return
    const { companyId, query } = this.searchForm.getRawValue()
    this.jobsService.fetchJobs(companyId!, query!)
  }

}
