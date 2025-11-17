import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoughCircleResult, HoughCirclesService } from '../../core/hough-circles.service';

interface CirclePreset {
  id: string;
  label: string;
  radius?: number;
}

@Component({
  selector: 'app-hough-circles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hough-circles.component.html',
  styleUrls: ['./hough-circles.component.css']
})
export class HoughCirclesComponent {
  readonly gridSize = 10;
  readonly radiusOptions = [2, 3, 4];

  image: number[][] = [];
  radius = this.radiusOptions[1];
  result?: HoughCircleResult;

  readonly presets: CirclePreset[] = [
    { id: 'center', label: 'Centro (5,5)' },
    { id: 'offset', label: 'Centro (7,4)', radius: 2 },
    { id: 'arc', label: 'Arco inferior' }
  ];
  private readonly defaultPreset = this.presets[0].id;
  selectedPreset = this.defaultPreset;

  constructor(private readonly hough: HoughCirclesService) {
    this.resetImage();
  }

  // Cuenta cuantos pixeles estan encendidos
  get activePixels(): number {
    return this.image.reduce(
      (sum, row) => sum + row.filter(cell => cell === 1).length,
      0
    );
  }

  // Centros ordenados por votos para mostrar en la tabla
  get topCenters() {
    return this.result?.topCenters ?? [];
  }

  // Limpia la imagen y aplica el patron actual
  resetImage(usePreset: boolean = true) {
    this.image = this.createEmptyImage();
    if (usePreset) {
      this.applyPresetPattern(this.selectedPreset);
    }
    this.result = undefined;
  }

  // Borra el lienzo sin aplicar patrones
  clearImage() {
    this.resetImage(false);
  }

  // Restablece el preset base del centro
  restoreDefaultPreset() {
    this.selectedPreset = this.defaultPreset;
    this.resetImage(true);
  }

  // Activa o apaga un pixel del lienzo
  toggle(x: number, y: number) {
    this.image[y][x] = this.image[y][x] === 1 ? 0 : 1;
    this.result = undefined;
  }

  // Selecciona un preset y redibuja la figura
  applyPreset(presetId: string) {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) {
      return;
    }
    this.selectedPreset = presetId;
    if (preset.radius) {
      this.radius = preset.radius;
    }
    this.resetImage(true);
  }

  // Cambia el radio fijo y regenera el patron
  setRadius(value: number) {
    this.radius = value;
    this.resetImage(true);
  }

  // Ejecuta la transformada de Hough para circulos
  runHough() {
    this.result = this.hough.houghCircles(this.image, this.radius);
  }

  // Utilidad para la plantilla
  range(n: number) {
    return Array.from({ length: n }, (_, i) => i);
  }

  // Construye una matriz vacia NxN
  private createEmptyImage() {
    return Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0)
    );
  }

  // Dibuja el patron correspondiente segun el id
  private applyPresetPattern(presetId: string) {
    switch (presetId) {
      case 'offset':
        this.drawCircle(7, 4, this.radius);
        break;
      case 'arc':
        this.drawCircle(5, 5, this.radius, { start: Math.PI, end: 2 * Math.PI });
        break;
      default:
        this.drawCircle(5, 5, this.radius);
    }
  }

  // Marca la circunferencia o arco dentro del lienzo
  private drawCircle(cx: number, cy: number, radius: number, arc?: { start: number; end: number }) {
    const r2 = radius * radius;
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist2 = dx * dx + dy * dy;
        if (Math.abs(dist2 - r2) <= 0.75) {
          if (!arc || this.angleInArc(Math.atan2(dy, dx), arc.start, arc.end)) {
            this.image[y][x] = 1;
          }
        }
      }
    }
  }

  // Verifica si un angulo pertenece al arco pedido
  private angleInArc(angle: number, start: number, end: number): boolean {
    const norm = (value: number) => {
      const twoPi = Math.PI * 2;
      return (value % twoPi + twoPi) % twoPi;
    };
    const a = norm(angle);
    let s = norm(start);
    let e = norm(end);
    if (s <= e) {
      return a >= s && a <= e;
    }
    return a >= s || a <= e;
  }
}
