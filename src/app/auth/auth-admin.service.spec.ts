import { TestBed } from '@angular/core/testing';

import { AuthAdminService } from './auth-admin.service';

describe('AuthAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthAdminService = TestBed.get(AuthAdminService);
    expect(service).toBeTruthy();
  });
});
