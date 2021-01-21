import { TestBed } from '@angular/core/testing';

import { CustomFormValidationService } from './custom-form-validation.service';

describe('CustomFormValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomFormValidationService = TestBed.get(CustomFormValidationService);
    expect(service).toBeTruthy();
  });
});
