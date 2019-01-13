import { TestBed } from '@angular/core/testing';

import { AuthGuardFalseService } from './auth-guard-false.service';

describe('AuthGuardFalseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardFalseService = TestBed.get(AuthGuardFalseService);
    expect(service).toBeTruthy();
  });
});
