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
import { MatDialog } from '@angular/material/dialog';
import { ExperimentDefaultsDialogComponent } from '../../components/experiment-defaults-dialog/experiment-defaults-dialog.component';


@Component({
  selector: 'app-experiment-type-create',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatButtonToggleModule, FormsModule],
  templateUrl: './experiment-type-create.component.html',
  styleUrl: './experiment-type-create.component.scss'
})
export class ExperimentTypeCreateComponent {
  form: FormGroup;
  fieldTypes = ['text', 'textarea', 'number', 'date', 'boolean', 'select'];
  experiment_types: any[] = [];
  mode: 'create' | 'view' = 'create';  // default mode

  constructor(private fb: FormBuilder, private api: ApiService, private dialog: MatDialog) {
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
      options: [''], // comma-separated options for select
      default: ['']
    }));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  openDefaultsDialog(exp_type: any) {
    const dialogRef = this.dialog.open(ExperimentDefaultsDialogComponent, {
      width: '500px',
      data: exp_type
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Save defaults to backend
        this.api.setExperimentTypeDefaults(exp_type.id, result).subscribe({
          next: () => {
            alert('Default values saved!');
            this.loadExperimentTypes();
          },
          error: (err) => console.error('Failed to save defaults', err)
        });
      }
    });
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
        options: f.type === 'select' && f.options
          ? f.options.split(',').map((s: string) => s.trim()).filter(Boolean)
          : undefined
      }))
    };

    this.api.createExperimentType(payload).subscribe({
      next: () => {
        alert('Experiment type created successfully!');
        this.form.reset();
        this.fields.clear();
        this.loadExperimentTypes();
        this.mode = 'view'; // switch to view after creating
      },
      error: (err: any) => console.error(err)
    });
  }

  loadExperimentTypes() {
  this.api.getExperimentTypes().subscribe({
    next: (res) => {
      this.experiment_types = res;

      // Fetch defaults for each type
      this.experiment_types.forEach((exp_type) => {
        this.api.getExperimentTypeDefaults(exp_type.id).subscribe({
          next: (res) => {
            exp_type.defaults = res.defaults || {};
          },
          error: (err) => {
            console.error(`Failed to fetch defaults for ${exp_type.name}`, err);
            exp_type.defaults = {};
          }
        });
      });
    },
    error: (err) => {
      console.error('Failed to load experiment types', err);
    }
  });
}

}

