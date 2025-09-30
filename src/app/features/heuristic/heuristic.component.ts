import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeuristicResult, HeuristicSearchService } from '../../core/heuristic-service.service';

@Component({
  standalone: true,
  selector: 'app-heuristic',
  templateUrl: './heuristic.component.html',
  styleUrls: ['./heuristic.component.css'],
  imports: [CommonModule, FormsModule]
})
export class HeuristicaComponent {
  // Parámetros por defecto (coherentes con Punto 1)
  start = 3;       // mm
  step = 1;        // mm
  tol = 0.2;       // mm
  minX = -20;      // mm
  maxX = 20;       // mm
  costPerMm = 1;   // costo por mm desplazado
  maxExpansions = 50000;

  result: HeuristicResult | null = null;

  constructor(private hs: HeuristicSearchService) {}

  run() {
    this.result = this.hs.aStar(
      this.start, this.step, this.tol, this.minX, this.maxX, this.costPerMm, this.maxExpansions
    );
  }

  reset() {
    this.result = null;
  }
}
