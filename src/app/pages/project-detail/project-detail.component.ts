import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, FormsModule, MatTooltipModule, MatFormFieldModule, MatOption, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {

  projectId!: number;
  experiments: any[] = [];
  experimentTypes: any[] = [];
  selectedBlueprintId!: number;
  startPickers: { [key: number]: MatDatepicker<Date> } = {};
  endPickers: { [key: number]: MatDatepicker<Date> } = {};


  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExperiments();
    this.loadExperimentTypes();
  }

  loadExperiments() {
    this.api.getExperiments(this.projectId).subscribe(res => {
      // Initialize expanded state for each experiment
      this.experiments = res.map(exp => ({ ...exp, expanded: false }));
    });

  }

  loadExperimentTypes() {
    this.api.getExperimentTypes().subscribe(res => {
      this.experimentTypes = res;
    });
  }

  toggleExperiment(exp: any) {
    exp.expanded = !exp.expanded;
  }

  toggleEdit(exp: any) {
    exp.editing = !exp.editing;

    if (exp.editing) {
      // Only create form if it doesn't exist yet
      if (!exp.editForm) {
        const group: any = {};

        // 1. Add all dynamic blueprint fields
        Object.keys(exp.data).forEach(key => {
          group[key] = [exp.data[key]]; // prepopulate with current values
        });

        // 2. Add standard static fields
        group.notes = [exp.notes || ''];
        group.start_date = [exp.start_date || null];
        group.end_date = [exp.end_date || null];
        group.moving_forward = [exp.moving_forward || ''];
        group.conclusions = [exp.conclusions || ''];

        exp.editForm = this.fb.group(group);
      }
    }
  }

  saveExperiment(exp: any) {
    if (!exp.editForm.valid) return;

    const formValue = exp.editForm.value;

    // Only send changed fields
    const payload: any = {};

    // Standard fields
    ['notes', 'start_date', 'end_date', 'moving_forward', 'conclusions'].forEach(key => {
      if (formValue[key] !== exp[key] && formValue[key] !== undefined) {
        payload[key] = formValue[key];
      }
    });

    // Dynamic fields
    const dataPayload: any = {};
    Object.keys(exp.data).forEach(key => {
      if (formValue[key] !== exp.data[key]) {
        dataPayload[key] = formValue[key];
      }
    });

    // Only include `data` if something changed
    if (Object.keys(dataPayload).length > 0) {
      payload.data = { ...exp.data, ...dataPayload }; // merge unchanged fields
    }

    this.api.partialUpdateExperiment(this.projectId, exp.id, payload).subscribe({
      next: () => {
        alert("Experiment updated successfully!");
        Object.assign(exp, payload); // merge changes into local experiment object
        exp.editing = false;
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteExperiment(exp: any) {
    const confirmed = confirm(`Are you sure you want to delete experiment "${exp.title || 'Untitled'}"?`);
    if (!confirmed) return;

    this.api.deleteExperiment(this.projectId, exp.id).subscribe({
      next: () => {
        alert('Experiment deleted successfully!');
        // Remove from local list
        this.experiments = this.experiments.filter(e => e.id !== exp.id);
      },
      error: (err) => console.error('Error deleting experiment:', err)
    });
  }

  getDataKeys(data: any): string[] {
    return data ? Object.keys(data) : [];
  }

  getExperimentTypeName(exp: any): string {
    const type = this.experimentTypes.find(t => t.id === exp.experiment_type_id);
    return type ? type.name : 'Unknown';
  }

  createExperiment() {
    if (!this.selectedBlueprintId) {
      alert('Please select a blueprint first!');
      return;
    }
    this.router.navigate([`/projects/${this.projectId}/experiments/new/${this.selectedBlueprintId}`]);
  }
}