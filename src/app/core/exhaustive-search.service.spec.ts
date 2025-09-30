import { TestBed } from '@angular/core/testing';

import { ExhaustiveSearchService } from './exhaustive-search.service';

describe('ExhaustiveSearchService', () => {
  let service: ExhaustiveSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExhaustiveSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
