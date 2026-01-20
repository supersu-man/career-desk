import { Routes } from '@angular/router';
import { UpdateWindowComponent } from './pages/update-window/update-window.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { SavedComponent } from './pages/saved/saved.component';
import { AppliedComponent } from './pages/applied/applied.component';
import { MultiSearchComponent } from './pages/multi-search/multi-search.component';
import { MultiSearchResultsComponent } from './pages/multi-search-results/multi-search-results.component';

export const routes: Routes = [
    { path: "", redirectTo: "jobs", pathMatch: "full" },
    {
        path: "", component: HomeComponent, children: [
            { path: "jobs", component: JobsComponent },
            { path: "multi-search", component: MultiSearchComponent },
            { path: "multi-search-results", component: MultiSearchResultsComponent },
            { path: "saved", component: SavedComponent },
            { path: "applied", component: AppliedComponent }
        ]
    },
    { path: "update", component: UpdateWindowComponent }
];
