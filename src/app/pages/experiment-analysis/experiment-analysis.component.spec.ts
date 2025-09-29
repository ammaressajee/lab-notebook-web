import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentAnalysisComponent } from './experiment-analysis.component';

describe('ExperimentAnalysisComponent', () => {
  let component: ExperimentAnalysisComponent;
  let fixture: ComponentFixture<ExperimentAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
