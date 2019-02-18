import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmDialogUpdatingComponent } from './alarm-dialog-updating.component';

describe('AlarmDialogUpdatingComponent', () => {
  let component: AlarmDialogUpdatingComponent;
  let fixture: ComponentFixture<AlarmDialogUpdatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmDialogUpdatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDialogUpdatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
