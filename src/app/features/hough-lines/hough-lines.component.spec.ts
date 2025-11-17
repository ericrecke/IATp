import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoughLinesComponent } from './hough-lines.component';

describe('HoughLinesComponent', () => {
  let component: HoughLinesComponent;
  let fixture: ComponentFixture<HoughLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoughLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoughLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
