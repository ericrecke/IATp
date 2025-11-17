import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IATp';
  isFullWidthPage = false;

  constructor(private router: Router) {
    this.setLayoutFromUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.setLayoutFromUrl(event.urlAfterRedirects));
  }

  private setLayoutFromUrl(url: string): void {
    const fullWidthRoutes = ['/exhaustive', '/heuristic', '/hough-lines', '/hough-circles'];
    this.isFullWidthPage = fullWidthRoutes.some(route => url.startsWith(route));
  }
}
