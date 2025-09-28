import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-experiment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './experiment-form.component.html',
  styleUrl: './experiment-form.component.scss'
})
export class ExperimentFormComponent implements OnInit {
  form: FormGroup;
  projectId!: number;
  experimentTypeId!: number;
  projectName: string = 'Loading Project...';
  experimentTypeName: string = '';
  experimentType: any;
  fieldKeyMap: Record<string, string> = {};
  pickers: Record<string, any> = {};
  public currentDate: Date = new Date();

  @ViewChildren('datepicker') pickerRefs!: QueryList<any>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      notes: [''],
      start_date: [null],
      end_date: [null],
      moving_forward: [''],
      conclusions: [''],
      data: this.fb.group({})
    });
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.experimentTypeId = Number(this.route.snapshot.paramMap.get('typeId'));
    this.loadProjectInfo();
    this.loadBlueprint();
  }

  ngAfterViewInit() {
    this.dataKeys.forEach((key, idx) => {
      const picker = this.pickerRefs.toArray()[idx];
      if (picker) this.pickers[key] = picker;
    });
    this.cdr.detectChanges();
  }

  get dataKeys() {
    return Object.keys(this.form.get('data')?.value || {});
  }

  getFieldType(key: string) {
    const originalName = this.fieldKeyMap[key];
    const field = this.experimentType?.fields?.find((f: any) => f.name === originalName);
    return field?.type || 'text';
  }

  getFieldOptions(key: string) {
    const originalName = this.fieldKeyMap[key];
    const field = this.experimentType?.fields?.find((f: any) => f.name === originalName);
    return field?.options || [];
  }

  getListControls(key: string): FormArray {
    return this.form.get(['data', key]) as FormArray;
  }

  addListItem(key: string) {
    this.getListControls(key).push(this.fb.control(''));
  }

  removeListItem(key: string, index: number) {
    this.getListControls(key).removeAt(index);
  }

  normalizeKey(name: string) {
    return name.replace(/\s+/g, '_').toLowerCase();
  }

  formatDateFriendly(date: Date): string {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadProjectInfo() {
    this.api.getProjects().subscribe(projects => {
      const project = projects.find(p => p.id === this.projectId);
      if (project) this.projectName = project.name;
    });
  }

  loadBlueprint() {
    this.api.getExperimentTypes().subscribe(types => {
      const experimentType = types.find(t => t.id === this.experimentTypeId);
      if (!experimentType) return;
      this.experimentType = experimentType;
      this.experimentTypeName = experimentType.name;

      // Step 1: build form
      this.buildForm(experimentType.fields);

      // Step 2: fetch defaults
      this.api.getExperimentTypeDefaults(this.experimentTypeId).subscribe(res => {
        const defaults = res.defaults || {};
        const patch: any = {};

        Object.keys(defaults).forEach(fName => {
          const key = this.normalizeKey(fName);
          const type = this.getFieldType(key);
          patch[key] = type === 'date' && defaults[fName] ? new Date(defaults[fName]) : defaults[fName];
        });

        setTimeout(() => {
          this.form.get('data')?.patchValue(patch);

          this.form.patchValue({
            notes: experimentType.default_data?.notes || '',
            start_date: experimentType.default_data?.start_date ? new Date(experimentType.default_data.start_date) : null,
            end_date: experimentType.default_data?.end_date ? new Date(experimentType.default_data.end_date) : null,
            moving_forward: experimentType.default_data?.moving_forward || '',
            conclusions: experimentType.default_data?.conclusions || ''
          });

          this.cdr.detectChanges();
        });

      });
    });
  }

  buildForm(fields: any[]) {
    const dataGroup = this.fb.group({});
    this.fieldKeyMap = {};

    fields.forEach(f => {
      const key = this.normalizeKey(f.name);
      this.fieldKeyMap[key] = f.name;
      const validators = f.required ? [Validators.required] : [];

      switch (f.type) {
        case 'number':
        case 'date':
          dataGroup.addControl(key, this.fb.control(null, validators));
          break;
        case 'boolean':
          dataGroup.addControl(key, this.fb.control(false, validators));
          break;
        case 'select':
          dataGroup.addControl(key, this.fb.control(f.options?.[0] || null, validators));
          break;
        default:
          dataGroup.addControl(key, this.fb.control('', validators));
      }
    });

    this.form.setControl('data', dataGroup);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const data: Record<string, any> = {};

    Object.keys(raw.data).forEach(k => {
      const value = raw.data[k];
      const type = this.getFieldType(k);
      data[this.fieldKeyMap[k]] = type === 'date' && value ? new Date(value).toISOString() : value;
    });

    const friendlyDate = this.formatDateFriendly(new Date());

    // fetch existing experiments first to calculate increment #
    this.api.getExperimentsByProject(this.projectId).subscribe(experiments => {
      const experimentNumber = experiments.length + 1;

      const payload = {
        project_id: this.projectId,
        experiment_type_id: this.experimentTypeId,
        notes: raw.notes,
        start_date: raw.start_date ? new Date(raw.start_date).toISOString() : null,
        end_date: raw.end_date ? new Date(raw.end_date).toISOString() : null,
        moving_forward: raw.moving_forward,
        conclusions: raw.conclusions,
        data,
        title: `Experiment ${experimentNumber} - ${friendlyDate}`
      };


      this.api.createExperiment(payload).subscribe({
        next: () => {
          alert('Experiment saved!');
          this.router.navigate(['/projects', this.projectId]);
        },
        error: err => console.error(err)
      });
    });
  }
}
