import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoughLinesService, HoughResult } from '../../core/hough-lines.service';

interface PresetOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-hough-lines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hough-lines.component.html',
  styleUrls: ['./hough-lines.component.css']
})
export class HoughLinesComponent {
  readonly gridSize = 10;
  image: number[][] = [];
  result?: HoughResult;

  readonly presets: PresetOption[] = [
    { id: 'diag', label: 'Diagonal principal' },
    { id: 'horizontal', label: 'Horizontal central' },
    { id: 'vertical', label: 'Vertical central' },
    { id: 'cross', label: 'Cruce en X' }
  ];
  private readonly defaultPreset = this.presets[0].id;
  selectedPreset = this.defaultPreset;

  constructor(private readonly hough: HoughLinesService) {
    this.resetImage();
  }

  // Cantidad de pixeles encendidos en el lienzo
  get activePixels(): number {
    return this.image.reduce(
      (sum, row) => sum + row.filter(cell => cell === 1).length,
      0
    );
  }

  // Lista de picos mas importantes del acumulador
  get peaks() {
    return this.result?.peaks ?? [];
  }

  // Limpia la imagen y opcionalmente aplica el patron seleccionado
  resetImage(usePreset: boolean = true) {
    this.image = this.createEmptyImage();
    if (usePreset) {
      this.applyPresetPattern(this.selectedPreset);
    }
    this.result = undefined;
  }

  // Restaura el preset por defecto (diagonal)
  restoreDefaultPreset() {
    this.selectedPreset = this.defaultPreset;
    this.resetImage(true);
  }

  // Borra todos los pixeles manualmente
  clearImage() {
    this.resetImage(false);
  }

  // Activa o apaga un pixel individual
  toggle(x: number, y: number) {
    this.image[y][x] = this.image[y][x] === 1 ? 0 : 1;
    this.result = undefined;
  }

  // Aplica un preset y re genera la imagen
  applyPreset(presetId: string) {
    this.selectedPreset = presetId;
    this.resetImage(true);
  }

  // Ejecuta la transformada de Hough
  runHough() {
    this.result = this.hough.houghTransform(this.image, { topPeaks: 4 });
  }

  // Utilidad para iterar en la plantilla
  range(n: number) {
    return Array.from({ length: n }, (_, i) => i);
  }

  // Crea una matriz vacia NxN
  private createEmptyImage() {
    return Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0)
    );
  }

  // Dibuja el patron correspondiente en la imagen
  private applyPresetPattern(presetId: string) {
    switch (presetId) {
      case 'horizontal': {
        const row = Math.floor(this.gridSize / 2);
        for (let x = 0; x < this.gridSize; x++) {
          this.image[row][x] = 1;
        }
        break;
      }
      case 'vertical': {
        const col = Math.floor(this.gridSize / 2);
        for (let y = 0; y < this.gridSize; y++) {
          this.image[y][col] = 1;
        }
        break;
      }
      case 'cross': {
        for (let i = 0; i < this.gridSize; i++) {
          this.image[i][i] = 1;
          this.image[i][this.gridSize - 1 - i] = 1;
        }
        break;
      }
      default: {
        for (let i = 0; i < this.gridSize; i++) {
          this.image[i][i] = 1;
        }
      }
    }
  }
}
