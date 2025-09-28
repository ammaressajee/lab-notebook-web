import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-experiment-defaults-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './experiment-defaults-dialog.component.html',
  styleUrl: './experiment-defaults-dialog.component.scss'
})
export class ExperimentDefaultsDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExperimentDefaultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Build form controls using existing defaults if available
    const controls: Record<string, any> = {};
    const defaults = data.defaults || {};

    data.fields.forEach((field: any) => {
      controls[field.name] = [defaults[field.name] ?? '']; // Use default value if exists
    });

    this.form = this.fb.group(controls);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value); // Return updated defaults
  }
}