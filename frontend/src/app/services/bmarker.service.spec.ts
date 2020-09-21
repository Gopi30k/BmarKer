import { TestBed } from '@angular/core/testing';

import { BmarkerService } from './bmarker.service';

describe('BmarkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BmarkerService = TestBed.get(BmarkerService);
    expect(service).toBeTruthy();
  });
});
