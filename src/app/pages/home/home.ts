import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hero', { static: true }) hero!: ElementRef<HTMLElement>;

  revealProgress = 0;
  private animationFrame?: number;

  ngOnInit(): void {
    document.body.classList.add('home-page');
    document.documentElement.style.setProperty('--home-reveal', '0');
  }

  ngAfterViewInit(): void {
    this.updateHeroReveal();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateHeroReveal(): void {
    if (this.animationFrame) return;

    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.calculateHeroReveal();
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    document.body.classList.remove('home-page');
    document.documentElement.style.removeProperty('--home-reveal');
  }

  private calculateHeroReveal(): void {
    const element = this.hero?.nativeElement;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollRange = Math.max(element.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / scrollRange, 0), 1);

    this.revealProgress = progress;
    element.style.setProperty('--hero-reveal', progress.toString());
    document.documentElement.style.setProperty('--home-reveal', progress.toString());
  }
}
