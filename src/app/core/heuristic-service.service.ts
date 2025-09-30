import { Injectable } from '@angular/core';

export interface HeuristicResult {
  success: boolean;
  path: number[];
  expansions: number;
  cost: number;
}

interface Node {
  x: number;
  g: number; // costo acumulado
  f: number; // g + h
  parent?: Node | null;
}

@Injectable({ providedIn: 'root' })
export class HeuristicSearchService {

  private isGoal(x: number, tol: number): boolean {
    return Math.abs(x) <= tol;
  }

  private neighbors(x: number, step: number, minX: number, maxX: number): number[] {
    const left = Math.max(minX, x - step);
    const right = Math.min(maxX, x + step);
    return (left === right) ? [left] : [left, right];
  }

  private moveCost(x1: number, x2: number, costPerMm: number): number {
    return Math.abs(x2 - x1) * costPerMm;
  }

  /** Heurística admisible: distancia restante más allá de la tolerancia, ponderada */
  private h(x: number, tol: number, costPerMm: number): number {
    const gap = Math.max(0, Math.abs(x) - tol);
    return gap * costPerMm;
  }

  private reconstruct(n: Node): number[] {
    const path: number[] = [];
    let cur: Node | undefined | null = n;
    while (cur) { path.push(cur.x); cur = cur.parent ?? null; }
    return path.reverse();
  }

  /** A*: f = g + h; */
  aStar(
    start: number,
    step: number,
    tol: number,
    minX: number,
    maxX: number,
    costPerMm: number,
    maxExpansions = 50000
  ): HeuristicResult {
    const startNode: Node = {
      x: start,
      g: 0,
      f: this.h(start, tol, costPerMm),
      parent: null
    };

    type OpenItem = Node;
    const open: OpenItem[] = [startNode];
    const bestG = new Map<number, number>([[start, 0]]);
    let expansions = 0;

    while (open.length) {
      // extrae el de menor f
      open.sort((a, b) => a.f - b.f);
      const cur = open.shift()!;

      if (this.isGoal(cur.x, tol)) {
        return { success: true, path: this.reconstruct(cur), expansions, cost: cur.g };
      }
      if (++expansions > maxExpansions) break;

      for (const nx of this.neighbors(cur.x, step, minX, maxX)) {
        const tentativeG = cur.g + this.moveCost(cur.x, nx, costPerMm);
        const prevBest = bestG.get(nx);

        if (prevBest === undefined || tentativeG < prevBest) {
          bestG.set(nx, tentativeG);
          const f = tentativeG + this.h(nx, tol, costPerMm);
          open.push({ x: nx, g: tentativeG, f, parent: cur });
        }
      }
    }
    return { success: false, path: [], expansions, cost: Infinity };
  }
}
