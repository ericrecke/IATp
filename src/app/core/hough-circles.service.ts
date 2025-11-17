import { Injectable } from '@angular/core';

export interface HoughCirclePeak {
  x: number;
  y: number;
  votes: number;
}

export interface HoughCircleResult {
  accumulator: number[][];
  maxValue: number;
  maxX: number;
  maxY: number;
  topCenters: HoughCirclePeak[];
}

@Injectable({ providedIn: 'root' })
export class HoughCirclesService {

  /** Transformada de Hough para circunferencias de radio fijo */
  houghCircles(image: number[][], radius: number, top: number = 4): HoughCircleResult {
    const size = image.length;
    if (!size || image.some(row => row.length !== size)) {
      throw new Error('La imagen debe ser una matriz cuadrada NxN');
    }

    const accumulator = Array.from({ length: size }, () =>
      Array(size).fill(0)
    );

    // Centros candidatos
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (image[y][x] !== 1) {
          continue;
        }
        for (let cy = 0; cy < size; cy++) {
          for (let cx = 0; cx < size; cx++) {
            const dx = x - cx;
            const dy = y - cy;
            if (Math.abs(dx * dx + dy * dy - radius * radius) < 1.0) {
              accumulator[cy][cx]++;
            }
          }
        }
      }
    }

    // Busqueda de maximo 
    let maxValue = 0;
    let maxX = 0;
    let maxY = 0;
    const peaks: HoughCirclePeak[] = [];

    for (let cy = 0; cy < size; cy++) {
      for (let cx = 0; cx < size; cx++) {
        const votes = accumulator[cy][cx];
        if (votes > maxValue) {
          maxValue = votes;
          maxX = cx;
          maxY = cy;
        }
        if (votes > 0) {
          peaks.push({ x: cx, y: cy, votes });
        }
      }
    }

    peaks.sort((a, b) => b.votes - a.votes);

    return {
      accumulator,
      maxValue,
      maxX,
      maxY,
      topCenters: peaks.slice(0, top)
    };
  }
}
