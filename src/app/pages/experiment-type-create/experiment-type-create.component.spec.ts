import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTypeCreateComponent } from './experiment-type-create.component';

describe('ExperimentTypeCreateComponent', () => {
  let component: ExperimentTypeCreateComponent;
  let fixture: ComponentFixture<ExperimentTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTypeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
