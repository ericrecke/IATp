import { TestBed } from '@angular/core/testing';

import { HoughLinesService } from './hough-lines.service';

describe('HoughLinesService', () => {
  let service: HoughLinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoughLinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
