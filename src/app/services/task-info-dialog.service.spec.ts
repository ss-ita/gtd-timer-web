import { TestBed } from '@angular/core/testing';

import { TaskInfoDialogService } from './task-info-dialog.service';

describe('TaskInfoDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskInfoDialogService = TestBed.get(TaskInfoDialogService);
    expect(service).toBeTruthy();
  });
});
