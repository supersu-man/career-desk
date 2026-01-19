import { Component, OnInit, signal } from '@angular/core';
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
    companies = signal<Company[]>([]);
    companyCountries = signal<Record<string, { name: string, value: string }[]>>({});
    searchQuery = new FormControl('');
    loading = signal(false);

    constructor(public jobsService: JobsService, private router: Router) { }

    async ngOnInit() {
        this.loading.set(true);
        const companies = await this.jobsService.getCompanies();
        this.companies.set(companies);

        await this.jobsService.loadPreferences();

        // Ensure all companies have a preference record
        const currentPrefs = this.jobsService.preferences();
        const updatedPrefs: CompanyPreference[] = [...currentPrefs];

        let changed = false;
        for (const company of companies) {
            if (!currentPrefs.find(p => p.companyId === company.id)) {
                updatedPrefs.push({ companyId: company.id, enabled: false });
                changed = true;
            }
        }

        if (changed) {
            await this.jobsService.savePreferences(updatedPrefs);
        }

        // Load countries for companies that have them
        for (const company of companies) {
            const countries = await this.jobsService.getCountries(company.id);
            if (countries && countries.length > 0) {
                this.companyCountries.update(all => ({ ...all, [company.id]: countries }));
            }
        }
        this.loading.set(false);
    }

    getPref(companyId: string): CompanyPreference {
        return this.jobsService.preferences().find(p => p.companyId === companyId) || { companyId, enabled: false };
    }

    toggleEnabled(companyId: string) {
        const prefs = this.jobsService.preferences().map(p => {
            if (p.companyId === companyId) {
                return { ...p, enabled: !p.enabled };
            }
            return p;
        });
        this.jobsService.savePreferences(prefs);
    }

    onCountryChange(companyId: string, countryValue: string) {
        const prefs = this.jobsService.preferences().map(p => {
            if (p.companyId === companyId) {
                return { ...p, defaultCountry: countryValue };
            }
            return p;
        });
        this.jobsService.savePreferences(prefs);
    }

    async performBulkSearch() {
        const query = this.searchQuery.value;
        if (!query) return;

        this.loading.set(true);
        await this.jobsService.bulkFetchJobs(query);
        this.loading.set(false);
        this.router.navigate(['/jobs']); // Navigate to jobs page to see results
    }
}
