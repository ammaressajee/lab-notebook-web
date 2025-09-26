import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatOption, MatSelectModule, MatButtonModule],
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
    this.api.getExperiments(this.projectId).subscribe(res => this.experiments = res);
  }

  loadExperimentTypes() {
    this.api.getExperimentTypes().subscribe(res => this.experimentTypes = res);
  }

  createExperiment() {
    if (!this.selectedBlueprintId) {
      alert('Please select a blueprint first!');
      return;
    }
    this.router.navigate([`/projects/${this.projectId}/experiments/new/${this.selectedBlueprintId}`]);
  }
}