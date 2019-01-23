import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminePageComponent } from './admine-page.component';

describe('AdminePageComponent', () => {
  let component: AdminePageComponent;
  let fixture: ComponentFixture<AdminePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
