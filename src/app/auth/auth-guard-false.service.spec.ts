import { TestBed } from '@angular/core/testing';

import { AuthGuardFalse } from './auth-guard-false.service';

describe('AuthGuardFalseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardFalse = TestBed.get(AuthGuardFalse);
    expect(service).toBeTruthy();
  });
});
