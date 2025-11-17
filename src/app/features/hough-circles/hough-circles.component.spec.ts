import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoughCirclesComponent } from './hough-circles.component';

describe('HoughCirclesComponent', () => {
  let component: HoughCirclesComponent;
  let fixture: ComponentFixture<HoughCirclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoughCirclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoughCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
