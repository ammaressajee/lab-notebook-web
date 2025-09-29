import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-experiment-analysis',
  imports: [MatCardModule, MatCheckboxModule, MatDividerModule, CommonModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, MatExpansionModule],
  templateUrl: './experiment-analysis.component.html',
  styleUrl: './experiment-analysis.component.scss'
})
export class ExperimentAnalysisComponent {

  allExperiments: any[] = [];
  searchTerm: string = '';
  selectAll: boolean = false;
  analysis: string | null = null;
  analysisSections: { title: string; content: string }[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadExperiments();
  }

  loadExperiments() {
    this.api.getAllExperiments().subscribe(res => {
      this.allExperiments = res.map(e => ({ ...e, selected: false }));
    });
  }

  filteredExperiments() {
    return this.allExperiments.filter(exp =>
      exp.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exp.experiment_type_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelectAll() {
    this.allExperiments.forEach(exp => exp.selected = this.selectAll);
  }

  getDataKeys(data: any): string[] {
    return data ? Object.keys(data) : [];
  }

 aanalysis: string = '';  // single string from backend

analyzeSelected() {
  const selectedIds = this.allExperiments
    .filter(e => e.selected)
    .map(e => e.id);

  if (!selectedIds.length) {
    alert("Please select at least one experiment!");
    return;
  }

  console.log("Sending experiment IDs to backend:", selectedIds);

  this.api.analyzeMultipleExperiments(selectedIds).subscribe({
    next: (res: any) => {
      this.analysis = res.analysis;
      console.log("LLM analysis response:", this.analysis);
    },
    error: (err) => console.error("Error analyzing experiments:", err)
  });
}



// Getter remains the same
get hasSelectedExperiments(): boolean {
  return this.allExperiments?.some(e => e.selected) ?? false;
}

}
