import { Component } from '@angular/core';
import { ExhaustiveSearchService, ExhaustiveResult } from '../../core/exhaustive-search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-exhaustive',
  templateUrl: './exhaustive.component.html',
  styleUrls: ['./exhaustive.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ExhaustiveComponent {
  // Parámetros
  start = 3;        // x inicial en mm
  step = 1;         // en mm
  tol = 0.2;        // tolerancia en mm
  minX = -20;       // límite exploración (mm)
  maxX = 20;
  depthLimit = 40;  // para DFS limitado

  algo: 'bfs' | 'dfs' = 'bfs';

  result: ExhaustiveResult | null = null;

  constructor(private search: ExhaustiveSearchService) {}

  run() {
    if (this.algo === 'bfs') {
      this.result = this.search.bfs(this.start, this.step, this.tol, this.minX, this.maxX);
    } else {
      this.result = this.search.dfsLimited(this.start, this.step, this.tol, this.minX, this.maxX, this.depthLimit);
    }
  }

  reset() {
    this.result = null;
  }
}
