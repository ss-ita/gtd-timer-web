import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmDialogNotificationComponent } from './alarm-dialog-notification.component';

describe('AlarmDialogNotificationComponent', () => {
  let component: AlarmDialogNotificationComponent;
  let fixture: ComponentFixture<AlarmDialogNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmDialogNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDialogNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
