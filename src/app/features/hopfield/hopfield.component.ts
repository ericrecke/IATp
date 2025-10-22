import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HopfieldService, PM1 } from '../../core/hopfield.service';

@Component({
  standalone: true,
  selector: 'app-hopfield',
  imports: [CommonModule, FormsModule],
  templateUrl: './hopfield.component.html',
  styleUrls: ['./hopfield.component.css']
})
export class HopfieldComponent implements OnInit {
  readonly size = 10;
  pattern: number[] = [];
  noisy: number[] = [];
  output: number[] = [];

  traceEnergies: number[] = [];
  traceRows: Array<{ it: number; E: number; dE: number }> = [];
  improvementPct = 0; // % de reducción de energía (0..100)

  noise = 0.15;
  iterations = 8;
  energyBefore?: number;
  energyAfter?: number;
  trained = false;

  notice: { text: string; type: 'success' | 'info' | 'warning' | 'danger' } | null = null;
  lastAction = '';
  isBusy = false;
  wasTrained = false;
  noiseApplied = false;
  recallDone = false;

  constructor(private H: HopfieldService) { }

  ngOnInit(): void {
    this.createRingPattern();
    this.noisy = this.pattern.slice();
  }

  private showNotice(text: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info', ms = 1000) {
    this.notice = { text, type };
    setTimeout(() => this.notice = null, ms);
  }

  //Metodo para crear el rignPattern de la imagen del grid.
  createRingPattern() {
    const grid = Array(100).fill(0);
    const paint = (r: number, c: number) => grid[r * this.size + c] = 1;
    const coords = [
      [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
      [1, 1], [1, 8],
      [2, 0], [2, 9],
      [3, 0], [3, 9],
      [4, 0], [4, 9],
      [5, 0], [5, 9],
      [6, 0], [6, 9],
      [7, 1], [7, 8],
      [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]
    ];
    coords.forEach(([r, c]) => paint(r, c));
    this.pattern = grid;
  }

  //Metodo para entrenar el patron cargado
  train() {
    const pat = this.H.bitsToPM1(this.pattern);
    this.H.train([pat]);
    this.trained = true;
    this.wasTrained = true;
    this.recallDone = false;
    this.lastAction = 'Entrenamiento cargado';
    this.showNotice('Patrón entrenado correctamente', 'success');
  }

  //Metodo para agregar ruido al patron cargado
  addNoise() {
    this.isBusy = true;
    this.noisy = this.H.addNoise(this.pattern, this.noise);
    this.output = Array(100).fill(0);
    this.energyBefore = undefined;
    this.energyAfter = undefined;
    this.noiseApplied = true;
    this.recallDone = false;
    this.lastAction = 'Ruido aplicado';
    this.showNotice(`Se aplicó ruido (${(this.noise * 100).toFixed(0)}%)`, 'warning');
    setTimeout(() => this.isBusy = false, 1000);
  }

  //Metodo para reconocer el patron con ruido
  recall() {
    if (!this.trained) this.train();
    const input = this.H.bitsToPM1(this.noisy);

    const trace = this.H.recallWithTrace(input, this.iterations);
    this.traceEnergies = trace.energies;

    // filas con delta
    this.traceRows = trace.energies.map((E, k, arr) => ({
      it: k,
      E,
      dE: k === 0 ? 0 : E - arr[k - 1]
    }));

    // salida final
    const outPM1 = trace.states[trace.states.length - 1];
    this.output = this.H.pm1ToBits(outPM1);

    this.energyBefore = trace.energies[0];
    this.energyAfter = trace.energies[trace.energies.length - 1];

    // % mejora (si energía inicial ≠ 0)
    const denom = Math.abs(this.energyBefore || 1e-9);
    const raw = ((this.energyBefore! - this.energyAfter!) / denom) * 100;
    this.improvementPct = Math.max(0, Math.min(100, raw));

    this.recallDone = true;
    this.showNotice('Reconocimiento ejecutado', 'success', 1000);
  }

  //Metodo para resetear la vista
  reset() {
    this.noisy = this.pattern.slice();
    this.output = Array(100).fill(0);
    this.energyBefore = undefined;
    this.energyAfter = undefined;
    this.noiseApplied = false;
    this.recallDone = false;
    this.lastAction = 'Estado inicial restablecido';
    this.showNotice('Se limpió la vista', 'info');
  }

  range(n: number) { return Array.from({ length: n }, (_, i) => i); }
  onCell(arr: number[], i: number) { return arr[i] === 1; }
}
