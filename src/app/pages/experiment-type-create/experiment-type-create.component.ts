import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@Component({
  selector: 'app-experiment-type-create',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatButtonToggleModule, FormsModule],
  templateUrl: './experiment-type-create.component.html',
  styleUrl: './experiment-type-create.component.scss'
})
export class ExperimentTypeCreateComponent {
  form: FormGroup;
  fieldTypes = ['text', 'textarea', 'number', 'date', 'boolean', 'select', 'list'];
  experiment_types: any[] = [];
  mode: 'create' | 'view' = 'create';  // default mode

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fields: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadExperimentTypes();
  }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  addField() {
    this.fields.push(this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false],
      options: [''] // comma-separated options for select
    }));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.value.name,
      fields: this.form.value.fields.map((f: any) => ({
        name: f.name,
        type: f.type,
        required: f.required,
        options: f.type === 'select' && f.options ? f.options.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined
      }))
    };

    this.api.createExperimentType(payload).subscribe({
      next: (res: any) => {
        alert('Experiment type created successfully!');
        this.form.reset();
        this.fields.clear();
        this.loadExperimentTypes();
      },
      error: (err: any) => console.error(err)
    });
  }

  loadExperimentTypes() {
    this.api.getExperimentTypes().subscribe({
      next: (res) => {
        this.experiment_types = res;
      },
      error: (err) => {
        console.error("Failed to load experiment types", err);
      }
    });
  }
}
