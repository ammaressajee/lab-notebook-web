import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatOption, MatSelectModule, MatButtonModule, MatDividerModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {

  projectId!: number;
  experiments: any[] = [];
  experimentTypes: any[] = [];
  selectedBlueprintId!: number;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

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