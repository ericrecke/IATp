import { Injectable } from '@angular/core';

export interface HoughLinePeak {
  rho: number;
  theta: number;
  thetaDeg: number;
  votes: number;
}

export interface HoughResult {
  accumulator: number[][]; // matriz [rho][theta]
  rhos: number[];
  thetas: number[];
  maxValue: number;
  maxRhoIndex: number;
  maxThetaIndex: number;
  peaks: HoughLinePeak[];
}

export interface HoughOptions {
  thetaStep?: number;
  rhoStep?: number;
  topPeaks?: number;
}

@Injectable({ providedIn: 'root' })
export class HoughLinesService {

  /** Ejecuta transformada de Hough en imagen binaria NxN */
  houghTransform(image: number[][], options: HoughOptions = {}): HoughResult {
    const size = image.length;
    if (!size || image.some(row => row.length !== size)) {
      throw new Error('La imagen debe ser una matriz cuadrada NxN');
    }

    const thetaStep = options.thetaStep ?? 2;
    const rhoStep = options.rhoStep ?? 1;
    const topPeaks = options.topPeaks ?? 3;

    // Rango de theta (-90 a 90 grados)
    const thetas: number[] = [];
    for (let t = -90; t <= 90; t += thetaStep) {
      thetas.push(t * Math.PI / 180);
    }

    // Distancia maxima desde el origen (diagonal)
    const maxCoordinate = size - 1;
    const diag = Math.ceil(Math.sqrt(maxCoordinate * maxCoordinate * 2));
    const rhoMin = -diag;
    const rhoMax = diag;

    const rhos: number[] = [];
    for (let r = rhoMin; r <= rhoMax; r += rhoStep) {
      rhos.push(parseFloat(r.toFixed(4)));
    }

    const accumulator = Array.from({ length: rhos.length },
      () => Array(thetas.length).fill(0)
    );

    // Votacion de cada pixel encendido
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (image[y][x] !== 1) {
          continue;
        }

        for (let ti = 0; ti < thetas.length; ti++) {
          const theta = thetas[ti];
          const rho = x * Math.cos(theta) + y * Math.sin(theta);
          const idx = Math.round((rho - rhoMin) / rhoStep);
          if (idx >= 0 && idx < accumulator.length) {
            accumulator[idx][ti]++;
          }
        }
      }
    }

    // Buscar maximo global y picos principales
    let maxValue = 0;
    let maxRhoIndex = 0;
    let maxThetaIndex = 0;
    const peaks: HoughLinePeak[] = [];

    for (let ri = 0; ri < accumulator.length; ri++) {
      for (let ti = 0; ti < accumulator[ri].length; ti++) {
        const votes = accumulator[ri][ti];
        if (votes > maxValue) {
          maxValue = votes;
          maxRhoIndex = ri;
          maxThetaIndex = ti;
        }
        if (votes > 0) {
          peaks.push({
            rho: rhos[ri],
            theta: thetas[ti],
            thetaDeg: parseFloat((thetas[ti] * 180 / Math.PI).toFixed(1)),
            votes
          });
        }
      }
    }

    peaks.sort((a, b) => b.votes - a.votes);
    const top = peaks.slice(0, topPeaks);

    return {
      accumulator,
      rhos,
      thetas,
      maxValue,
      maxRhoIndex,
      maxThetaIndex,
      peaks: top
    };
  }
}
