import { TestBed } from '@angular/core/testing';

import { HoughCirclesService } from './hough-circles.service';

describe('HoughCirclesService', () => {
  let service: HoughCirclesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoughCirclesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
