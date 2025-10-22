import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopfieldComponent } from './hopfield.component';

describe('HopfieldComponent', () => {
  let component: HopfieldComponent;
  let fixture: ComponentFixture<HopfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HopfieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HopfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
