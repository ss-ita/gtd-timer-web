import { TestBed } from '@angular/core/testing';

import { RavenErrorHandlerService } from './raven-error-handler.service';

describe('RavenErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RavenErrorHandlerService = TestBed.get(RavenErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
