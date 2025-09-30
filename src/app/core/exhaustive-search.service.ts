import { Injectable } from '@angular/core';

export interface ExhaustiveResult {
  success: boolean;
  path: number[];     // secuencia de x
  expansions: number; // nodos visitados
}

@Injectable({ providedIn: 'root' })
export class ExhaustiveSearchService {
  // --- Meta: |x| <= tol
  private isGoal(x: number, tol: number): boolean {
    return Math.abs(x) <= tol;
  }

  // --- Sucesores en 1D
  private neighbors(x: number, step: number, minX: number, maxX: number): number[] {
    const left = Math.max(minX, x - step);
    const right = Math.min(maxX, x + step);
    // Evitar duplicados si pegamos contra límites
    return (left === right) ? [left] : [left, right];
  }

  // --- Reconstruye camino usando mapa de padres
  private reconstruct(goal: number, parent: Map<number, number | null>): number[] {
    const path: number[] = [];
    let cur: number | null = goal;
    while (cur !== null) {
      path.push(cur);
      cur = parent.get(cur) ?? null;
    }
    return path.reverse();
  }

  /** BFS (Primero en Anchura) */
  bfs(start: number, step: number, tol: number, minX: number, maxX: number): ExhaustiveResult {
    const q: number[] = [start];
    const parent = new Map<number, number | null>([[start, null]]);
    const visited = new Set<number>([start]);
    let expansions = 0;

    while (q.length) {
      const x = q.shift()!;
      expansions++;

      if (this.isGoal(x, tol)) {
        return { success: true, path: this.reconstruct(x, parent), expansions };
      }

      for (const nx of this.neighbors(x, step, minX, maxX)) {
        if (!visited.has(nx)) {
          visited.add(nx);
          parent.set(nx, x);
          q.push(nx);
        }
      }
    }
    return { success: false, path: [], expansions };
  }

  /** DFS con profundidad límite */
  dfsLimited(start: number, step: number, tol: number, minX: number, maxX: number, depthLimit: number): ExhaustiveResult {
    const stack: Array<{ x: number; d: number }> = [{ x: start, d: 0 }];
    const parent = new Map<number, number | null>([[start, null]]);
    const visitedThisPath = new Set<number>([start]); // opcional (por rama)
    let expansions = 0;

    while (stack.length) {
      const { x, d } = stack.pop()!;
      expansions++;

      if (this.isGoal(x, tol)) {
        return { success: true, path: this.reconstruct(x, parent), expansions };
      }

      if (d < depthLimit) {
        // orden: primero izquierda, luego derecha
        const succ = this.neighbors(x, step, minX, maxX);
        for (const nx of succ) {
          if (!parent.has(nx)) { // evitar nodo ya enlazado
            parent.set(nx, x);
            stack.push({ x: nx, d: d + 1 });
          }
        }
      }
    }
    return { success: false, path: [], expansions };
  }
}
