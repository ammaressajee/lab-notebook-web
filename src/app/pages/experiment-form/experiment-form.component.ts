import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class ExperimentFormComponent implements OnInit{
  form: FormGroup;
  projectId!: number;
  experimentTypeId!: number;
  experimentFields: any[] = [];
  fieldKeyMap: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      notes: [''],
      data: this.fb.group({})
    });
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.experimentTypeId = Number(this.route.snapshot.paramMap.get('typeId'));
    this.loadExperimentFields();
  }

  get dataKeys() {
    return Object.keys((this.form.get('data') as FormGroup).controls);
  }

  getFieldType(key: string): string {
    const originalName = this.fieldKeyMap[key];
    const field = this.experimentFields.find(f => f.name === originalName);
    return field?.type || 'text';
  }

  getFieldOptions(key: string): string[] {
    const originalName = this.fieldKeyMap[key];
    const field = this.experimentFields.find(f => f.name === originalName);
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

  loadExperimentFields() {
    // Get experiment fields
    this.api.getExperimentTypes().subscribe(types => {
      const experimentType = types.find(t => t.id === this.experimentTypeId);
      if (!experimentType) return;

      this.experimentFields = experimentType.fields;
      this.buildForm(experimentType.fields);

      // Get defaults separately
      this.api.getExperimentTypeDefaults(this.experimentTypeId).subscribe(res => {
        const defaults = res.defaults || {};
        const patch: any = {};
        Object.keys(defaults).forEach(fName => {
          const key = this.normalizeKey(fName);
          patch[key] = defaults[fName];
        });
        (this.form.get('data') as FormGroup).patchValue(patch);
        console.log('Form after patch:', this.form.value);
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
        case 'list':
          const arr = this.fb.array([]);
          dataGroup.addControl(key, arr);
          break;
        case 'textarea':
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
      data[this.fieldKeyMap[k]] = raw.data[k];
    });

    const payload = {
      project_id: this.projectId,
      experiment_type_id: this.experimentTypeId,
      notes: raw.notes,
      data
    };

    this.api.createExperiment(payload).subscribe({
      next: () => {
        alert('Experiment saved!');
        this.router.navigate(['/projects', this.projectId]);
      },
      error: err => console.error(err)
    });
  }
}