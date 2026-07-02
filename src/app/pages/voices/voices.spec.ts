import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Voices } from './voices';

describe('Voices', () => {
  let component: Voices;
  let fixture: ComponentFixture<Voices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Voices],
    }).compileComponents();

    fixture = TestBed.createComponent(Voices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
