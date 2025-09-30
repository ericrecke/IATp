import { TestBed } from '@angular/core/testing';

import { HeuristicServiceService } from './heuristic-service.service';

describe('HeuristicServiceService', () => {
  let service: HeuristicServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeuristicServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
