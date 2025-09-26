import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDataComponent } from './submit-data.component';

describe('SubmitDataComponent', () => {
  let component: SubmitDataComponent;
  let fixture: ComponentFixture<SubmitDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
