import { TestBed } from '@angular/core/testing';

import { HttpCallInterceptorService } from './http-call-interceptor.service';

describe('HttpCallInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpCallInterceptorService = TestBed.get(HttpCallInterceptorService);
    expect(service).toBeTruthy();
  });
});
