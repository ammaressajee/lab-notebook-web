import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentDefaultsDialogComponent } from './experiment-defaults-dialog.component';

describe('ExperimentDefaultsDialogComponent', () => {
  let component: ExperimentDefaultsDialogComponent;
  let fixture: ComponentFixture<ExperimentDefaultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentDefaultsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentDefaultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
