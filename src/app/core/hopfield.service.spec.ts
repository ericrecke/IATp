import { TestBed } from '@angular/core/testing';

import { HopfieldService } from './hopfield.service';

describe('HopfieldService', () => {
  let service: HopfieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HopfieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
