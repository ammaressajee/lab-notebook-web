import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTypeListComponent } from './experiment-type-list.component';

describe('ExperimentTypeListComponent', () => {
  let component: ExperimentTypeListComponent;
  let fixture: ComponentFixture<ExperimentTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
