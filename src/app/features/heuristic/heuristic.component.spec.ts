import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuristicComponent } from './heuristic.component';

describe('HeuristicComponent', () => {
  let component: HeuristicComponent;
  let fixture: ComponentFixture<HeuristicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeuristicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuristicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
