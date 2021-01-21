import { TestBed, async, inject } from '@angular/core/testing';

import { BmarkerAuthGuard } from './bmarker-auth.guard';

describe('BmarkerAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BmarkerAuthGuard]
    });
  });

  it('should ...', inject([BmarkerAuthGuard], (guard: BmarkerAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
