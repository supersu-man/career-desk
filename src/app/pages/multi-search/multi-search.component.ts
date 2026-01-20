import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobsService } from '../../services/jobs.service';
import { Company, CompanyPreference } from '../../../electron/interface';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

class MultiSearch {
    company!: Company;
    countries!: { name: string, value: string }[];
    preferences!: CompanyPreference;
}

@Component({
    selector: 'app-multi-search',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './multi-search.component.html',
})
export class MultiSearchComponent implements OnInit {

    jobsService = inject(JobsService)
    storageService = inject(StorageService)
    router = inject(Router)

    searchQuery = new FormControl('');
    loading = signal(false);
    multiSearches = signal<MultiSearch[]>([]);


    async ngOnInit() {
        this.loading.set(true);
        const companies = await this.jobsService.getCompanies();
        const prefs = await this.storageService.loadPreferences();
        const multiSearches: MultiSearch[] = [];

        // Load countries for companies that have them
        for (const company of companies) {
            const countries = await this.jobsService.getCountries(company.id);
            multiSearches.push({ company, countries, preferences: prefs.find(p => p.companyId === company.id) || { companyId: company.id, enabled: false } });
        }
        this.multiSearches.set(multiSearches);
        console.log(this.multiSearches());
        this.loading.set(false);
    }

    async performBulkSearch() {
        const query = this.searchQuery.value;
        if (!query) return;

        this.loading.set(true);
        const preferences = this.multiSearches().map(m => m.preferences).filter(p => p.enabled);
        console.log(preferences)
        
        await this.storageService.savePreferences(preferences);
        await this.jobsService.bulkFetchJobs(query, preferences);
        this.loading.set(false);
        this.router.navigate(['/jobs']);
    }
}
