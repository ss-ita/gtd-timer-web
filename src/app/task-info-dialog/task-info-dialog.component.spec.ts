import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfoDialogComponent } from './task-info-dialog.component';

describe('TaskInfoDialogComponent', () => {
  let component: TaskInfoDialogComponent;
  let fixture: ComponentFixture<TaskInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
