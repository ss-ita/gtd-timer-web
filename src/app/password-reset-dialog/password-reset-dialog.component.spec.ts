import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetDialogComponent } from './password-reset-dialog.component';

describe('PasswordResetDialogComponent', () => {
  let component: PasswordResetDialogComponent;
  let fixture: ComponentFixture<PasswordResetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
