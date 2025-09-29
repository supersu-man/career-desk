import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Company, JobPosting } from '../../utility/interface';

@Component({
  selector: 'app-home',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  api = (window as any).api

  searchForm = new FormGroup({
    query: new FormControl(),
    companyId: new FormControl()
  })
  companies: Company[] = []
  data: JobPosting[] = []

  ngOnInit(): void {
    this.getCompanies()
  }

  fetch = async () => {
    const companyId = this.searchForm.getRawValue().companyId
    if(!companyId) return
    const data = await this.api.fetchJobs(companyId, {})
    this.data = data
  }

  getCompanies = async () => {
    const companies = await this.api.getCompanies()
    this.companies = companies
    console.log(this.companies)
  }
}
