import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetDialogComponent } from './preset-dialog.component';

describe('PresetDialogComponent', () => {
  let component: PresetDialogComponent;
  let fixture: ComponentFixture<PresetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
