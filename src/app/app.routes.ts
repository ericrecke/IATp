import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ExhaustiveComponent } from './features/exhaustive/exhaustive.component';
import { HeuristicaComponent } from './features/heuristic/heuristic.component';
import { HopfieldComponent } from './features/hopfield/hopfield.component';
import { HoughLinesComponent } from './features/hough-lines/hough-lines.component';
import { HoughCirclesComponent } from './features/hough-circles/hough-circles.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'exhaustive', component: ExhaustiveComponent },
    { path: 'heuristic', component: HeuristicaComponent },
    { path: 'hopfield', component: HopfieldComponent },
    { path: 'hough-lines', component: HoughLinesComponent },
    { path: 'hough-circles', component: HoughCirclesComponent },

];
