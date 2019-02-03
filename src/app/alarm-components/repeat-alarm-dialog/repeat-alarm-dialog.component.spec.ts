import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatAlarmDialogComponent } from './repeat-alarm-dialog.component';

describe('RepeatAlarmDialogComponent', () => {
  let component: RepeatAlarmDialogComponent;
  let fixture: ComponentFixture<RepeatAlarmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatAlarmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatAlarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
