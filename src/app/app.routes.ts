import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ExhaustiveComponent } from './features/exhaustive/exhaustive.component';
import { HeuristicaComponent } from './features/heuristic/heuristic.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'exhaustive', component: ExhaustiveComponent },
    { path: 'heuristic', component: HeuristicaComponent },
];
