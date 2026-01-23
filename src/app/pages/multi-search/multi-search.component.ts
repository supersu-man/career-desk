import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JobsService } from '../../services/jobs.service';
import { Company, CompanyPreference } from '../../../electron/interface';
import { Router } from '@angular/router';

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
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    templateUrl: './multi-search.component.html',
})
export class MultiSearchComponent implements OnInit {

    jobsService = inject(JobsService)
    router = inject(Router)

    searchQuery = signal('');
    loading = signal(false);
    multiSearches = signal<MultiSearch[]>([]);



    async ngOnInit() {
        this.loading.set(true);
        const companies = this.jobsService.companies();
        const prefs = await this.jobsService.fetchPreferences();
        console.log(prefs)
        const multiSearches: MultiSearch[] = [];

        for (const company of companies) {
            const countries = await window.api.getCountries(company.id);
            multiSearches.push({
                company,
                countries,
                preferences: prefs.companyPreferences.find(p => p.companyId === company.id) || { companyId: company.id, enabled: false }
            });
        }
        this.multiSearches.set(multiSearches);
        this.searchQuery.set(prefs.searchQuery)
        this.loading.set(false);
    }

    async savePreferences() {
        const companyPrefs = this.multiSearches().map(m => m.preferences);
        const currentPrefs = await this.jobsService.fetchPreferences();
        await this.jobsService.savePreferences({
            ...currentPrefs,
            companyPreferences: companyPrefs,
            searchQuery: this.searchQuery()
        });
    }

    async onAutoFetchToggle(enabled: boolean) {
        // const settings = { ...this.jobsService.autoFetchSettings(), enabled };
        // await this.jobsService.saveAutoFetchSettings(settings);
    }

    async onIntervalChange(interval: 30 | 60 | 360) {
        // const settings = { ...this.jobsService.autoFetchSettings(), interval };
        // await this.jobsService.saveAutoFetchSettings(settings);
    }

    async performBulkSearch() {
        const query = this.searchQuery() || '';
        if (!query) return;
        const companyPreferences = this.multiSearches().map(m => m.preferences).filter(p => p.enabled);
        if(companyPreferences.length === 0) return;
        this.loading.set(true);

        const currentPrefs = await this.jobsService.fetchPreferences();
        await this.jobsService.savePreferences({
            ...currentPrefs,
            searchQuery: query,
            companyPreferences
        });

        const allJobs = await this.jobsService.bulkFetchJobs(query, companyPreferences);
        this.jobsService.multiSearchJobs.set(allJobs);
        this.loading.set(false);
        this.router.navigate(['/multi-search-results']);
    }
}
