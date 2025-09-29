import { Routes } from '@angular/router';
import { UpdateWindowComponent } from './pages/update-window/update-window.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path:"", component: HomeComponent },
    { path:"update", component: UpdateWindowComponent }
];
