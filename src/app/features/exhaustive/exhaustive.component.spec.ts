import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhaustiveComponent } from './exhaustive.component';

describe('ExhaustiveComponent', () => {
  let component: ExhaustiveComponent;
  let fixture: ComponentFixture<ExhaustiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhaustiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhaustiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
