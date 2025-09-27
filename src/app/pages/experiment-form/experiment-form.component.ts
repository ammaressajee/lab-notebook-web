import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-experiment-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule, 
    MatIconModule, 
    MatCardModule],
  templateUrl: './experiment-form.component.html',
  styleUrl: './experiment-form.component.scss'
})
export class ExperimentFormComponent {

  form: FormGroup;
  projectId!: number;
  experimentTypeId!: number;
  experimentType: any;
  fieldKeyMap: Record<string, string> = {}; // normalized key => original field name

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      notes: [''],
      data: this.fb.group({})
    });
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.experimentTypeId = Number(this.route.snapshot.paramMap.get('typeId'));
    this.loadBlueprint();
  }

  loadBlueprint() {
    this.api.getExperimentTypeFields(this.experimentTypeId).subscribe((res) => {
      this.experimentType = res;
      this.buildForm(res.fields);
    });
  }

  public normalizeKey(name: string) {
    return name.replace(/\s+/g, '_').toLowerCase();
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
          dataGroup.addControl(key, this.fb.control(null, validators));
          break;
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
          dataGroup.addControl(key, this.fb.array([]));
          break;
        case 'textarea':
        default:
          dataGroup.addControl(key, this.fb.control('', validators));
      }
    });

    this.form.setControl('data', dataGroup);
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
      title: raw.title,
      notes: raw.notes,
      data
    };

    this.api.createExperiment(payload).subscribe({
      next: () => {
        alert('Experiment saved!');
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (err: any) => console.error(err)
    });
  }

}
