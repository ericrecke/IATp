import { Injectable } from '@angular/core';

export type PM1 = -1 | 1;

@Injectable({ providedIn: 'root' })
export class HopfieldService {
  W: number[][] = [];
  N = 0;

  /* Entrenamiento hebbiano  */
  train(patterns: PM1[][]) {
    if (!patterns.length) return;
    this.N = patterns[0].length;
    this.W = Array.from({ length: this.N }, () => Array(this.N).fill(0));

    for (const p of patterns) {
      for (let i = 0; i < this.N; i++) {
        for (let j = 0; j < this.N; j++) {
          if (i !== j) this.W[i][j] += p[i] * p[j];
        }
      }
    }
  }

  /** Actualización síncrona */
  recall(input: PM1[], iterations = 10): PM1[] {
    let s = input.slice();
    for (let t = 0; t < iterations; t++) {
      const next = s.slice();
      for (let i = 0; i < this.N; i++) {
        let h = 0;
        for (let j = 0; j < this.N; j++) h += this.W[i][j] * s[j];
        next[i] = h >= 0 ? 1 : -1;
      }
      s = next;
    }
    return s;
  }

  /** Energía del estado */
  energy(state: PM1[]): number {
    let E = 0;
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.N; j++) {
        E -= 0.5 * state[i] * this.W[i][j] * state[j];
      }
    }
    return E;
  }

  // --- utilidades ---
  bitsToPM1(arr: number[]): PM1[] {
    return arr.map(b => (b ? 1 : -1)) as PM1[];
  }
  pm1ToBits(arr: PM1[]): number[] {
    return arr.map(v => (v > 0 ? 1 : 0));
  }

  addNoise(bits: number[], p = 0.15): number[] {
    return bits.map(v => (Math.random() < p ? (v ? 0 : 1) : v));
  }
}
