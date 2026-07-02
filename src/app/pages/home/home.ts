import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  @ViewChild('hero', { static: true }) hero!: ElementRef<HTMLElement>;

  revealProgress = 0;

  ngAfterViewInit(): void {
    this.updateHeroReveal();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateHeroReveal(): void {
    const element = this.hero?.nativeElement;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollRange = Math.max(element.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / scrollRange, 0), 1);

    this.revealProgress = Number(progress.toFixed(3));
  }
}
