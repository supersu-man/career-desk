import { Routes } from '@angular/router';
import { UpdateWindowComponent } from './pages/update-window/update-window.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { SavedComponent } from './pages/saved/saved.component';
import { AppliedComponent } from './pages/applied/applied.component';

export const routes: Routes = [
    { path: "", redirectTo: "jobs", pathMatch: "full" },
    {
        path: "", component: HomeComponent, children: [
            { path: "jobs", component: JobsComponent },
            { path: "saved", component: SavedComponent },
            { path: "applied", component: AppliedComponent }
        ]
    },
    { path: "update", component: UpdateWindowComponent }
];
